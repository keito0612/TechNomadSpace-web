'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    // エラーをコンソールに出力
    if (typeof window !== 'undefined') {
        console.error('Global error:', error);
    }

    return (
        <html lang="ja">
            <body className="min-h-screen bg-black flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-red-900/30 rounded-full">
                            <AlertTriangle className="w-16 h-16 text-red-500" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-2">500</h1>
                    <h2 className="text-xl font-semibold text-gray-300 mb-4">
                        サーバーエラーが発生しました
                    </h2>
                    <p className="text-gray-500 mb-8">
                        申し訳ございません。予期しないエラーが発生しました。<br />
                        しばらく時間をおいて再度お試しください。
                    </p>

                    <button
                        onClick={reset}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors mx-auto"
                    >
                        <RefreshCw className="w-5 h-5" />
                        再試行
                    </button>
                </div>
            </body>
        </html>
    );
}
