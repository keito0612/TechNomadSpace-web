<?php

namespace App\Http\Controllers;

use App\Consts\UserType;
use App\Exceptions\ProviderMismatchException;
use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Response;

class SocialAuthController extends Controller
{
    private const ALLOWED_PROVIDERS = ['google'];

    public function redirect(string $provider, Request $request): JsonResponse
    {
        try {
            $this->validateProvider($provider);

            $from = $request->query('from', 'login');
            $state = base64_encode(json_encode([
                'provider' => $provider,
                'from' => $from,
            ]));

            $url = Socialite::driver($provider)
                ->stateless()
                ->with(['state' => $state])
                ->redirect()
                ->getTargetUrl();

            return response()->json([
                'redirect_url' => $url,
            ], Response::HTTP_OK);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            Log::error('Social auth redirect error: ' . $e->getMessage());
            return response()->json([
                'message' => '認証の開始に失敗しました。',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function callback(string $provider, Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        try {
            $this->validateProvider($provider);

            $driver = Socialite::driver($provider)->stateless();
            $tokenResponse = $driver->getAccessTokenResponse($request->input('code'));
            $socialUser = $driver->userFromToken($tokenResponse['access_token']);

            $email = $socialUser->getEmail();
            $providerId = $socialUser->getId();

            if ($email === null) {
                return response()->json([
                    'message' => 'メールアドレスが取得できませんでした',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $result = DB::transaction(function () use ($provider, $providerId, $email, $socialUser) {
                $user = User::where('provider', $provider)
                    ->where('provider_id', $providerId)
                    ->first();

                if ($user) {
                    return ['user' => $user, 'isNewUser' => false];
                }

                $existingUser = User::where('email', $email)->first();

                if ($existingUser) {
                    if ($existingUser->provider !== null && $existingUser->provider !== $provider) {
                        throw new ProviderMismatchException('既に別のソーシャルアカウントでアカウントを作成しています。');
                    }

                    $existingUser->update([
                        'provider' => $provider,
                        'provider_id' => $providerId,
                    ]);

                    return ['user' => $existingUser, 'isNewUser' => false];
                }

                $name = $socialUser->getName()
                    ?? $socialUser->getNickname()
                    ?? explode('@', $email)[0];

                $newUser = User::create([
                    'name' => $name,
                    'email' => $email,
                    'provider' => $provider,
                    'provider_id' => $providerId,
                    'type' => UserType::USER,
                ]);

                return ['user' => $newUser, 'isNewUser' => true];
            });

            $user = $result['user'];

            if ($result['isNewUser']) {
                Mail::to($user->email)->send(new WelcomeMail($user));
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ], Response::HTTP_OK);

        } catch (ProviderMismatchException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_CONFLICT);

        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (\Exception $e) {
            return response()->json([
                'message' => '認証に失敗しました。もう一度お試しください。',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function validateProvider(string $provider): void
    {
        if (!\in_array($provider, self::ALLOWED_PROVIDERS, true)) {
            throw new InvalidArgumentException('設定されていないログイン方法でログインしようとしています。');
        }
    }
}
