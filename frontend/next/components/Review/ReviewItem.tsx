'use client';
import { Photo, Review } from "@/types/types"
import StarsRatings from "../StarsRating";
import ProfileImage from "../Profile/ProfileImage";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import LikeButton from "./LikeButton";

interface ReviewItemProps {
    review: Review;
    onImageClick: (imageNumbar: number) => void;
}

const LoadingSpinner = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
    );
};

// 写真グリッドアイテム
const PhotoGridItem = ({
    index,
    photo,
    onClick,
}: {
    index: number;
    photo: Photo;
    onClick: (index: number) => void;
}) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => onClick(index)}
        >
            {isLoading && <LoadingSpinner />}
            <Image
                src={photo.photoUrl}
                alt={photo.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

const ReviewComment = ({ comment }: { comment: string }) => {
    return (
        <div className="text-white break-all">
            {comment}
        </div>
    );
}

const ReviewImages = ({ photos, className, onImageClick }: { photos: Photo[], className?: string, onImageClick: (index: number) => void }) => {
    if (!photos || photos.length === 0) {
        return null;
    }
    return (
        <div className={cn('grid grid-cols-2 gap-3   w-full mt-2', className)}>
            {photos.map((photo: Photo, index: number) => <PhotoGridItem key={photo.id} index={index} photo={photo} onClick={onImageClick} />)}
        </div>
    );
}

const ReviewUser = ({ name, postedAtHuman }: { name: string, postedAtHuman: string }) => {
    return (
        <div className="w-full flex flex-row justify-between">
            <div className="text-white break-all">
                {name}
            </div>
            <div className="text-white break-all">
                {postedAtHuman}
            </div>
        </div>
    );
}

const ReviewItem = (props: ReviewItemProps) => {
    return (
        <div className="p-2 w-full flex flex-row justify-start items-start gap-3">
            <ProfileImage sizes={36} imageUrl={props.review.user.image_path} />
            <div className="flex-1 flex flex-col justify-start items-start">
                <ReviewUser name={props.review.user.name} postedAtHuman={props.review.posted_at_human} />
                <StarsRatings className="py-1" size={18} rating={props.review.rating} />
                <ReviewComment comment={props.review.comment} />
                <ReviewImages className="pt-2" photos={props.review.photos} onImageClick={props.onImageClick} />
                <div className="mt-2">
                    <LikeButton
                        reviewId={props.review.id}
                        initialIsLiked={props.review.isLiked}
                        initialLikeCount={props.review.likeCount}
                    />
                </div>
            </div>
        </div>
    );
}

export default ReviewItem;

