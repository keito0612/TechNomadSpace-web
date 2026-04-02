'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationFavoriteService } from '@/services/LocationFavoriteService';
import Modal from './Modal';

interface FavoriteButtonProps {
    locationId: number;
    initialIsFavorited: boolean;
    className?: string;
}

export const FavoriteButton = ({
    locationId,
    initialIsFavorited,
    className,
}: FavoriteButtonProps) => {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleToggleFavorite = async () => {
        if (isLoading) return;

        setIsLoading(true);
        await LocationFavoriteService.toggleFavorite({
            locationId,
            success: (response) => {
                setIsFavorited(response.isFavorited);
                setIsLoading(false);
            },
            failure: (error) => {
                if (error.isAuthError) {
                    setTitle("ログインが必要です");
                    setMessage("お気に入り機能を利用するにはログインしてください。");
                    setIsLoginModalOpen(true);
                } else {
                    setTitle("エラーが発生しました");
                    setMessage("もう一度お試しください。問題が解決しない場合は、運営までお問い合わせください。");
                    setIsLoginModalOpen(true);
                    console.error('Failed to toggle favorite:', error.message);
                }
                setIsLoading(false);
            },
        });
    };

    return (
        <>
            <button
                onClick={handleToggleFavorite}
                disabled={isLoading}
                className={cn(
                    "inline-flex items-center transition-colors",
                    isLoading && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                <Heart
                    className={cn(
                        "h-7 w-7 transition-colors",
                        isFavorited
                            ? "fill-blue-700 text-blue-700"
                            : "fill-none text-gray-400 hover:text-blue-700"
                    )}
                />
            </button>
            <Modal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                type="Warning"
                title={title}
                message={message}
            />
        </>
    );
};

export default FavoriteButton;
