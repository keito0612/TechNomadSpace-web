import Link from 'next/link';
import { Search, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-blue-900/30 rounded-full">
                        <Search className="w-16 h-16 text-blue-500" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-white mb-2">404</h1>
                <h2 className="text-xl font-semibold text-gray-300 mb-4">
                    ページが見つかりません
                </h2>
                <p className="text-gray-500 mb-8">
                    お探しのページは存在しないか、<br />
                    移動した可能性があります。
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                >
                    <Home className="w-5 h-5" />
                    ホームに戻る
                </Link>
            </div>
        </div>
    );
}
