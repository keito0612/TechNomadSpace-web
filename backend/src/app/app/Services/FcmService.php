<?php

namespace App\Services;

use App\Models\User;
use DevKandil\NotiFire\Facades\Fcm;
use Illuminate\Support\Facades\Log;

class FcmService
{
    /**
     * 単一ユーザーへ通知を送信
     */
    public function sendToUser(User $user, string $title, string $body, array $data = []): bool
    {
        // ユーザーの通知設定を確認
        if ($user->setting && !$user->setting->is_notifacation) {
            Log::info('User has disabled notifications', ['user_id' => $user->id]);
            return false;
        }

        $token = $user->getFcmToken();

        if (!$token) {
            Log::info('No FCM token found for user', ['user_id' => $user->id]);
            return false;
        }

        return $this->sendToToken($token, $title, $body, $data);
    }

    /**
     * 複数ユーザーへ通知を送信
     */
    public function sendToUsers(array $users, string $title, string $body, array $data = []): bool
    {
        $success = false;

        foreach ($users as $user) {
            // ユーザーの通知設定を確認
            if ($user->setting && !$user->setting->is_notifacation) {
                continue;
            }

            $token = $user->getFcmToken();
            if ($token) {
                $result = $this->sendToToken($token, $title, $body, $data);
                if ($result) {
                    $success = true;
                }
            }
        }

        return $success;
    }

    /**
     * トークンに直接通知を送信
     */
    protected function sendToToken(string $token, string $title, string $body, array $data = []): bool
    {
        try {
            $notification = Fcm::withTitle($title)
                ->withBody($body)
                ->withSound('default');

            if (!empty($data)) {
                $notification->withAdditionalData($data);
            }

            $result = $notification->sendNotification($token);

            Log::info('FCM notification sent', [
                'success' => $result,
                'title' => $title,
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Failed to send FCM notification', [
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * トークンを登録
     */
    public function registerToken(User $user, string $token): bool
    {
        return $user->updateFcmToken($token);
    }

    /**
     * トークンを削除
     */
    public function removeToken(User $user): bool
    {
        return $user->update(['fcm_token' => null]);
    }
}
