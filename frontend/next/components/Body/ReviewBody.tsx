import { Review } from '@/types/types';
import React from 'react'
import ReviewItem from '../Review/ReviewItem';


interface ReviewBodyProps {
    reviews: Review[];
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
    return (
        <div className='w-full h-full pb-28'>
            {
                props.reviews.length === 0 ? <NoReview /> : props.reviews.map((review) => <ReviewItem key={review.id} review={review} />)
            }
        </div>
    )
}

export default ReviewBody;