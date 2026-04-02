'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/services/AuthService';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            const code = searchParams.get('code');
            const provider = searchParams.get('provider') || localStorage.getItem('oauth_provider');
            const errorParam = searchParams.get('error');

            if (errorParam) {
                setError(errorParam);
                setIsProcessing(false);
                return;
            }

            if (!code || !provider) {
                setError('認証情報が不足しています');
                setIsProcessing(false);
                return;
            }

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider}/callback`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({ code }),
                    }
                );

                const data = await res.json();

                if (res.ok && data.token) {
                    localStorage.removeItem('oauth_provider');
                    AuthService.setSesstion(data.token);
                    router.push('/');
                } else {
                    setError(data.message || '認証に失敗しました');
                    setIsProcessing(false);
                }
            } catch {
                setError('認証処理中にエラーが発生しました');
                setIsProcessing(false);
            }
        };

        processCallback();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">認証エラー</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                        >
                            ログイン画面に戻る
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600">認証中...</p>
                </div>
            </div>
        );
    }

    return null;
}
