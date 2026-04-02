'use client';
import { Photo, Review } from '@/types/types';
import ReviewItem from '../Review/ReviewItem';
import ImageModal from '../Image/ImagesModal';
import { useState } from 'react';
import { LocationData } from '@/types/location';


interface ReviewBodyProps {
    reviews: Review[];
    location: LocationData;
}
const NoReview = () => {
    return (
        <div className='w-full  flex items-center justify-center'>
            <span className='font-bold text-center'>
                現在、投稿されたレビューがありません。
            </span>
        </div>
    );
}
const ReviewBody = (props: ReviewBodyProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handlePhotoClick = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };
    return (
        <div className='w-full h-full pb-28'>
            {
                props.reviews.length === 0 ? <NoReview /> : props.reviews.map((review) => <ReviewItem key={review.id} review={review} onImageClick={(index: number) => handlePhotoClick(index)} />)
            }
            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectImageIndex={selectedIndex}
                title={props.location.name}
                images={props.location.photos}
            />
        </div>
    )
}

export default ReviewBody;