'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReviewLikeService } from '@/services/ReviewLikeService';
import Modal from '../Modal';

interface LikeButtonProps {
    reviewId: number;
    initialIsLiked: boolean;
    initialLikeCount: number;
    className?: string;
}

export const LikeButton = ({
    reviewId,
    initialIsLiked,
    initialLikeCount,
    className,
}: LikeButtonProps) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const handleToggleLike = async () => {
        if (isLoading) return;

        setIsLoading(true);
        await ReviewLikeService.toggleLike({
            reviewId,
            success: (response) => {
                setIsLiked(response.isLiked);
                setLikeCount(response.likeCount);
                setIsLoading(false);
            },
            failure: (error) => {
                if (error.isAuthError) {
                    setModalTitle("ログインが必要です");
                    setModalMessage("いいね機能を利用するにはログインしてください。");
                } else {
                    setModalTitle("エラーが発生しました");
                    setModalMessage("もう一度お試しください。");
                }
                setIsModalOpen(true);
                setIsLoading(false);
            },
        });
    };

    return (
        <>
            <button
                onClick={handleToggleLike}
                disabled={isLoading}
                className={cn(
                    "inline-flex items-center gap-1 transition-colors",
                    isLoading && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                <ThumbsUp
                    className={cn(
                        "w-4 h-4 transition-all",
                        isLiked
                            ? "fill-blue-500 text-blue-500"
                            : "fill-none text-gray-400 hover:text-blue-400"
                    )}
                />
                <span className={cn(
                    "text-sm",
                    isLiked ? "text-blue-500" : "text-gray-400"
                )}>
                    {likeCount}
                </span>
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type="Warning"
                title={modalTitle}
                message={modalMessage}
            />
        </>
    );
};

export default LikeButton;
