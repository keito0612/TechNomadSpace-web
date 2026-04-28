'use client';

import { useState } from 'react';
import { Profile, ProfileTabType, Review, MenuAction, ResultType, ModalState } from '@/types/types';
import ReviewItem from '@/components/Review/ReviewItem';
import ImageModal from '@/components/Image/ImagesModal';
import TabsContainer from '@/components/TabsContainer';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';
import { ReviewService } from '@/services/ReviewService';

interface ProfileReviewTabsProps {
    profile: Profile;
    isOwnProfile?: boolean;
}



const EmptyState = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p>{message}</p>
        </div>
    );
};

interface ReviewListItemProps {
    review: Review;
    showMenu?: boolean;
    onMenuAction?: (action: MenuAction, reviewId: number) => void;
}

const ReviewListItem = ({ review, showMenu = false, onMenuAction }: ReviewListItemProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="border-b border-gray-800 pb-3">
                <ReviewItem
                    review={review}
                    onImageClick={handleImageClick}
                    showMenu={showMenu}
                    onMenuAction={onMenuAction}
                />
            </div>
            {review.photos && review.photos.length > 0 && (
                <ImageModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    selectImageIndex={selectedImageIndex}
                    title=""
                    images={review.photos}
                />
            )}
        </>
    );
};

interface ReviewListProps {
    reviews: Review[];
    emptyMessage: string;
    showMenu?: boolean;
    onMenuAction?: (action: MenuAction, reviewId: number) => void;
}

const ReviewList = ({ reviews, emptyMessage, showMenu = false, onMenuAction }: ReviewListProps) => {
    if (!reviews || reviews.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div>
            {reviews.map((review) => (
                <ReviewListItem
                    key={review.id}
                    review={review}
                    showMenu={showMenu}
                    onMenuAction={onMenuAction}
                />
            ))}
        </div>
    );
};

const ProfileReviewTabs = ({ profile, isOwnProfile = false }: ProfileReviewTabsProps) => {
    const router = useRouter();
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmModal, setConfirmModal] = useState<ModalState>({
        isOpen: false,
        type: 'Warning',
        title: '',
        message: '',
    });
    const [resultModal, setResultModal] = useState<ModalState>({
        isOpen: false,
        type: 'Success',
        title: '',
        message: '',
    });

    const handleMenuAction = (action: MenuAction, reviewId: number) => {
        if (action === 'edit') {
            const review = profile.reviews.find(r => r.id === reviewId);
            if (review) {
                router.push(`/locations/${review.locationId}/review/${reviewId}`);
            }
        } else if (action === 'delete') {
            setDeleteTargetId(reviewId);
            setConfirmModal({
                isOpen: true,
                type: 'Warning',
                title: '投稿を削除しますか？',
                message: 'この操作は取り消せません。',
            });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;

        setIsDeleting(true);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));

        await ReviewService.delete({
            reviewId: deleteTargetId,
            success: () => {
                setResultModal({
                    isOpen: true,
                    type: 'Success',
                    title: '削除が完了しました',
                    message: '',
                });
            },
            failure: (error) => {
                setResultModal({
                    isOpen: true,
                    type: 'Error',
                    title: 'エラーが発生しました',
                    message: error.message,
                });
            },
        });

        setIsDeleting(false);
        setDeleteTargetId(null);
    };

    const handleResultModalClose = () => {
        setResultModal(prev => ({ ...prev, isOpen: false }));
        if (resultModal.type === 'Success') {
            router.refresh();
        }
    };

    const tabs: { key: ProfileTabType; label: string }[] = [
        { key: 'post', label: '投稿' },
        { key: 'like', label: 'いいね' },
    ];

    const bodys = [
        <ReviewList
            key="post"
            reviews={profile.reviews}
            emptyMessage="投稿がありません"
            showMenu={isOwnProfile}
            onMenuAction={isOwnProfile ? handleMenuAction : undefined}
        />,
        <ReviewList
            key="like"
            reviews={profile.liked_reviews}
            emptyMessage="いいねした投稿がありません"
        />,
    ];

    return (
        <>
            <TabsContainer<ProfileTabType>
                defalutValue="post"
                tabs={tabs}
                bodys={bodys}
            />

            {/* 削除確認モーダル */}
            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={handleDeleteConfirm}
                confirmLabel="削除する"
                cancelLabel="キャンセル"
            />

            {/* 結果モーダル */}
            <Modal
                isOpen={resultModal.isOpen}
                onClose={handleResultModalClose}
                title={resultModal.title}
                message={resultModal.message}
                type={resultModal.type}
                onCloneLabel="OK"
            />
        </>
    );
};

export default ProfileReviewTabs;
