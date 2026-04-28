'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

interface ErrorViewProps {
    isAuthError: boolean;
}

export default function ErrorView({ isAuthError }: ErrorViewProps) {
    if (isAuthError) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
                <p className="text-gray-400 mb-4">ログインが必要です</p>
                <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                >
                    ログイン
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-gray-400 mb-4">お知らせの取得に失敗しました</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
            >
                再読み込み
            </button>
        </div>
    );
}
