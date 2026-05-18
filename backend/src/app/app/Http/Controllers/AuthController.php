<?php

namespace App\Http\Controllers;

use App\Consts\UserType;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Mail\ResetPasswordMail;
use App\Mail\WelcomeMail;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try{
            $user = User::create([
                'name' => $request->input('name'),
                'type' => UserType::USER,
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            Mail::to($user->email)->send(new WelcomeMail($user));
            DB::commit();
            return response()->json([
                'message' => '登録が完了しました',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ], Response::HTTP_CREATED);
        }catch(Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $email = $request->input('email');
        $password = $request->input('password');
        $user = User::where('email', $email)->first();

        if (is_null($user)|| !Hash::check($password, $user->password)) {
            return response()->json([
                'message' => 'メールアドレスまたはパスワードが正しくありません',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], Response::HTTP_OK);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'ログアウトしました',
        ], Response::HTTP_OK);
    }

    public function sendPasswordResetEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'メールアドレスは必須です。',
            'email.email'    => '有効なメールアドレスを入力してください。',
            'email.exists'   => 'このメールアドレスは登録されていません。',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $user = User::where('email', $request->email)->first();
            $token = Str::random(60);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                [
                    'token' => Hash::make($token),
                    'created_at' => now(),
                ]
            );

            $resetUrl = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);

            Mail::to($user->email)->send(new ResetPasswordMail($resetUrl));

            return response()->json(['message' => 'パスワードリセットメールを送信しました'], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json(['message' => 'サーバーに問題が発生しました。もう一度お試しください。'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
            $resetData = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$resetData) {
                return response()->json(['message' => '無効なトークンです'], Response::HTTP_UNAUTHORIZED);
            }

            // 有効期限チェック（1時間）
            if (now()->diffInMinutes($resetData->created_at) > 60) {
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                return response()->json(['message' => 'トークンの有効期限が切れています'], Response::HTTP_UNAUTHORIZED);
            }

            // トークンチェック
            if (!Hash::check($request->token, $resetData->token)) {
                return response()->json(['message' => '無効なトークンです'], Response::HTTP_UNAUTHORIZED);
            }

            // パスワード更新
            $user = User::where('email', $request->email)->first();
            $user->password = Hash::make($request->password);
            $user->save();

            // トークン削除
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            return response()->json(['message' => 'パスワードが更新されました'], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json(['message' => 'サーバ側で問題'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
