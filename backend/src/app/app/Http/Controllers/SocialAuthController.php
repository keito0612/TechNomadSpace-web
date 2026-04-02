<?php

namespace App\Http\Controllers;

use App\Exceptions\ProviderMismatchException;
use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Response;

class SocialAuthController extends Controller
{
    private const ALLOWED_PROVIDERS = ['google', 'twitter'];

    public function redirect(string $provider): JsonResponse
    {
        try {
            $this->validateProvider($provider);

            $url = Socialite::driver($provider)
                ->stateless()
                ->redirect()
                ->getTargetUrl();

            return response()->json([
                'redirect_url' => $url,
            ], Response::HTTP_OK);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    }

    public function callback(string $provider, Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        try {
            $this->validateProvider($provider);

            $socialUser = Socialite::driver($provider)
                ->stateless()
                ->user();

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
                        throw new ProviderMismatchException($existingUser->provider);
                    }

                    $existingUser->update([
                        'provider' => $provider,
                        'provider_id' => $providerId,
                    ]);

                    return ['user' => $existingUser, 'isNewUser' => false];
                }

                $newUser = User::create([
                    'name' => $socialUser->getNickname() ?? '',
                    'email' => $email,
                    'provider' => $provider,
                    'provider_id' => $providerId,
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
            throw new InvalidArgumentException('Invalid provider');
        }
    }
}
