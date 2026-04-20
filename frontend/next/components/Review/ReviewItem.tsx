'use client';
import { Photo, Review, MenuAction } from "@/types/types"
import StarsRatings from "../StarsRating";
import ProfileImage from "../Profile/ProfileImage";
import { cn } from "@/lib/utils";
import { MoreVertical, Loader2, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import LikeButton from "./LikeButton";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ReviewItemProps {
    review: Review;
    onImageClick: (imageNumbar: number) => void;
    onMenuAction?: (action: MenuAction, reviewId: number) => void;
    showMenu?: boolean;
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
                unoptimized={process.env.NODE_ENV === 'development'}
                src={photo.photoUrl}
                alt={photo.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
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
        <div className={cn('grid grid-cols-2 gap-3 w-full mt-2', className)}>
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

interface ReviewMenuButtonProps {
    onEdit: () => void;
    onDelete: () => void;
}

const ReviewMenuButton = ({ onEdit, onDelete }: ReviewMenuButtonProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                aria-label="メニューを開く"
            >
                <MoreVertical className="w-5 h-5 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="w-4 h-4" />
                    編集
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <Trash2 className="w-4 h-4" />
                    削除
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const ReviewItem = ({ review, onImageClick, onMenuAction, showMenu = false }: ReviewItemProps) => {
    const handleEdit = () => {
        onMenuAction?.('edit', review.id);
    };

    const handleDelete = () => {
        onMenuAction?.('delete', review.id);
    };

    return (
        <div className="p-2 w-full flex flex-row justify-start items-start gap-3">
            <ProfileImage sizes={36} imageUrl={review.user.image_path} />
            <div className="flex-1 flex flex-col justify-start items-start">
                <div className="w-full flex flex-row justify-between items-center">
                    <div>
                        <ReviewUser name={review.user.name} postedAtHuman={review.posted_at_human} />
                        <StarsRatings className="py-1" size={18} rating={review.rating} />
                    </div>
                    {showMenu && (
                        <ReviewMenuButton onEdit={handleEdit} onDelete={handleDelete} />
                    )}
                </div>
                <ReviewComment comment={review.comment} />
                <ReviewImages className="pt-2" photos={review.photos} onImageClick={onImageClick} />
                <div className="mt-2">
                    <LikeButton
                        reviewId={review.id}
                        initialIsLiked={review.isLiked}
                        initialLikeCount={review.likeCount}
                    />
                </div>
            </div>
        </div>
    );
}

export default ReviewItem;
