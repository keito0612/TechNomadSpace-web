'use client';

import { useState } from 'react';
import { Profile, ProfileTabType, Review } from '@/types/types';
import ReviewItem from '@/components/Review/ReviewItem';
import ImageModal from '@/components/Image/ImagesModal';
import TabsContainer from '@/components/TabsContainer';
import { ThumbsUp } from 'lucide-react';

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
            <div className="border-b border-gray-800">
                <ReviewItem review={review} onImageClick={handleImageClick} />
                <div className="px-2 pb-3 flex items-center gap-1 text-gray-400">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{review.likes?.length ?? 0}</span>
                </div>
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
