'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { MessagePayload } from 'firebase/messaging';
import { FcmService } from '@/services/FcmService';
import { AuthService } from '@/services/AuthService';

interface NotificationContextType {
    isSupported: boolean;
    isPermissionGranted: boolean;
    fcmToken: string | null;
    requestPermission: () => Promise<void>;
    lastNotification: MessagePayload | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const FCM_TOKEN_KEY = 'fcm_token';

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [isSupported, setIsSupported] = useState(false);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);
    const [fcmToken, setFcmToken] = useState<string | null>(null);
    const [lastNotification, setLastNotification] = useState<MessagePayload | null>(null);

    const initializeFcm = useCallback(async () => {
        const supported = await FcmService.initialize();
        setIsSupported(supported);

        if (!supported) {
            return;
        }

        if (Notification.permission === 'granted') {
            setIsPermissionGranted(true);
            const savedToken = localStorage.getItem(FCM_TOKEN_KEY);
            if (savedToken) {
                setFcmToken(savedToken);
            }
        }

        FcmService.onNotification((payload) => {
            console.log('Foreground notification received:', payload);
            setLastNotification(payload);

            // フォアグラウンドでも通知を表示
            if (payload.notification) {
                new Notification(payload.notification.title || '新しい通知', {
                    body: payload.notification.body,
                    icon: '/icon-192x192.png',
                });
            }
        });
    }, []);

    const requestPermission = useCallback(async () => {
        const token = await FcmService.requestPermissionAndGetToken();

        if (token) {
            setIsPermissionGranted(true);
            setFcmToken(token);
            localStorage.setItem(FCM_TOKEN_KEY, token);

            const authToken = AuthService.getSesstion();
            if (authToken) {
                await FcmService.registerTokenWithBackend({
                    token,
                    success: () => {
                        console.log('FCM token registered with backend');
                    },
                    failure: (error) => {
                        console.error('Failed to register FCM token:', error.message);
                    },
                });
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            initializeFcm();
        }
    }, [initializeFcm]);

    useEffect(() => {
        const authToken = AuthService.getSesstion();

        if (!authToken || !isSupported) {
            return;
        }

        const savedFcmToken = localStorage.getItem(FCM_TOKEN_KEY);

        if (savedFcmToken) {
            // 既存トークンをバックエンドに同期
            FcmService.registerTokenWithBackend({
                token: savedFcmToken,
                success: () => {
                    console.log('FCM token synced with backend on load');
                },
                failure: (error) => {
                    if (error.isAuthError) {
                        localStorage.removeItem(FCM_TOKEN_KEY);
                    }
                },
            });
        } else if (Notification.permission === 'default') {
            // トークンがなく、まだ権限を聞いていない場合は自動的に要求
            requestPermission();
        } else if (Notification.permission === 'granted') {
            // 権限はあるがトークンがない場合は再取得
            requestPermission();
        }
    }, [isSupported, requestPermission]);

    return (
        <NotificationContext.Provider
            value={{
                isSupported,
                isPermissionGranted,
                fcmToken,
                requestPermission,
                lastNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
