'use client';

import { useState } from 'react';
import { Profile, ProfileTabType, Review } from '@/types/types';
import ReviewItem from '@/components/Review/ReviewItem';
import ImageModal from '@/components/Image/ImagesModal';
import TabsContainer from '@/components/TabsContainer';

interface ProfileReviewTabsProps {
    profile: Profile;
}

const EmptyState = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p>{message}</p>
        </div>
    );
};

const ReviewListItem = ({ review }: { review: Review }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="border-b border-gray-800 pb-3">
                <ReviewItem review={review} onImageClick={handleImageClick} />
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

const ReviewList = ({ reviews, emptyMessage }: { reviews: Review[]; emptyMessage: string }) => {
    if (!reviews || reviews.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div>
            {reviews.map((review) => (
                <ReviewListItem key={review.id} review={review} />
            ))}
        </div>
    );
};

const ProfileReviewTabs = ({ profile }: ProfileReviewTabsProps) => {
    const tabs: { key: ProfileTabType; label: string }[] = [
        { key: 'post', label: '投稿' },
        { key: 'like', label: 'いいね' },
    ];

    const bodys = [
        <ReviewList
            key="post"
            reviews={profile.reviews}
            emptyMessage="投稿がありません"
        />,
        <ReviewList
            key="like"
            reviews={profile.liked_reviews}
            emptyMessage="いいねした投稿がありません"
        />,
    ];

    return (
        <TabsContainer<ProfileTabType>
            defalutValue="post"
            tabs={tabs}
            bodys={bodys}
        />
    );
};

export default ProfileReviewTabs;
