import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/firebase';
import { UtilApi } from '@/lib/utilApi';
import { AuthService } from './AuthService';

export class FcmService {
    private static isInitialized = false;

    /**
     * FCMを初期化
     */
    static async initialize(): Promise<boolean> {
        if (this.isInitialized) {
            return true;
        }

        const messaging = await getFirebaseMessaging();
        if (!messaging) {
            return false;
        }

        this.isInitialized = true;
        return true;
    }

    /**
     * 通知権限を要求してトークンを取得
     */
    static async requestPermissionAndGetToken(): Promise<string | null> {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('Notification permission denied');
                return null;
            }

            const messaging = await getFirebaseMessaging();
            if (!messaging) {
                return null;
            }

            const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
            if (!vapidKey) {
                console.error('VAPID key is not configured');
                return null;
            }

            // Service Workerを登録して準備完了を待つ
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            await navigator.serviceWorker.ready;

            // Service WorkerにFirebase設定を送信
            const firebaseConfig = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            };

            const activeWorker = registration.active || registration.waiting || registration.installing;
            if (activeWorker) {
                activeWorker.postMessage({
                    type: 'FIREBASE_CONFIG',
                    config: firebaseConfig,
                });
            }

            const token = await getToken(messaging, {
                vapidKey,
                serviceWorkerRegistration: registration,
            });

            return token;
        } catch (error) {
            console.error('Failed to get FCM token:', error);
            return null;
        }
    }

    /**
     * バックエンドにトークンを登録
     */
    static async registerTokenWithBackend({
        token,
        success,
        failure,
    }: {
        token: string;
        success: () => void;
        failure: (error: { message: string; isAuthError: boolean }) => void;
    }): Promise<void> {
        try {
            const authToken = AuthService.getSesstion();

            const res = await fetch(`${UtilApi.API_URL}/api/fcm/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ token }),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    failure({ message: 'ログインが必要です', isAuthError: true });
                } else {
                    failure({ message: 'トークンの登録に失敗しました', isAuthError: false });
                }
                return;
            }

            success();
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
            failure({ message, isAuthError: false });
        }
    }

    /**
     * バックエンドからトークンを削除
     */
    static async removeTokenFromBackend({
        success,
        failure,
    }: {
        success: () => void;
        failure: (error: { message: string }) => void;
    }): Promise<void> {
        try {
            const authToken = AuthService.getSesstion();

            const res = await fetch(`${UtilApi.API_URL}/api/fcm/token`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!res.ok) {
                failure({ message: 'トークンの削除に失敗しました' });
                return;
            }

            success();
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
            failure({ message });
        }
    }

    /**
     * フォアグラウンド通知リスナーを設定
     */
    static async onNotification(callback: (payload: MessagePayload) => void): Promise<(() => void) | null> {
        const messaging = await getFirebaseMessaging();
        if (!messaging) {
            return null;
        }

        return onMessage(messaging, callback);
    }
}
