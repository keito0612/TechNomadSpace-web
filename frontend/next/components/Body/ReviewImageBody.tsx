import { ReviewImage } from '@/types/types';
import React from 'react'

interface ReviewImageBody {
    reviewImages: ReviewImage[];
}

export const ReviewImageBody = (props: ReviewImageBody) => {
    return (
        <div>ImagesBody</div>
    )
}


export default ReviewImageBody;