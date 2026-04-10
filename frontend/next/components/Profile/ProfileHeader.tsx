'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/types';
import ProfileImage from './ProfileImage';
import ProfileEditModal from './ProfileEditModal';
import { useRouter } from 'next/navigation';
import { log } from 'console';

const BackgroundImage = ({ imagePath }: { imagePath: string | null }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative w-full h-36 bg-gray-700">
            {imagePath ? (
                <>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 z-10">
                            <Loader2 className="w-10 h-10 text-blue-800 animate-spin" />
                        </div>
                    )}
                    <Image
                        src={imagePath}
                        alt="背景画像"
                        fill
                        unoptimized
                        className="object-cover"
                        onLoad={() => setIsLoading(false)}
                    />
                </>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-gray-500" />
                </div>
            )}
        </div>
    );
};

const ProfileImageWithBackgroundImage = ({
    profileImagePath,
    backgroundImagePath,
}: {
    profileImagePath: string | null;
    backgroundImagePath: string | null;
}) => {
    return (
        <div className="w-full">
            <BackgroundImage imagePath={backgroundImagePath} />
            <div className="px-4">
                <div className="-mt-10">
                    <ProfileImage imageUrl={profileImagePath} sizes={80} />
                </div>
            </div>
        </div>
    );
};

const ProfileStatus = ({
    reviewCount,
    likedReviewsCount,
}: {
    reviewCount: number;
    likedReviewsCount: number;
}) => {
    return (
        <div className="flex gap-4 mt-3 text-sm text-gray-300">
            <span>{reviewCount} レビュー</span>
            <span>{likedReviewsCount} いいね</span>
        </div>
    );
};

const ProfileComment = ({ comment }: { comment: string }) => {
    return (
        comment && (
            <p className="mt-2 text-sm text-gray-300 break-words line-clamp-4">
                {comment}
            </p>
        )
    );
};

const ProfileName = ({ name }: { name: string }) => {
    return (
        <h1 className="text-lg font-bold text-white pb-2 break-words">{name}</h1>
    );
};

const EditProfileButton = ({ onClick, className }: { onClick: () => void, className: string }) => {
    return (
        <div className={className}>
            <Button
                variant="outline"
                size="sm"
                className="w-full  rounded-full border-gray-600 text-white hover:bg-gray-800"
                onClick={onClick}
            >
                <Pencil className="w-4 h-4 mr-1" />
                編集
            </Button>
        </div>
    );
}

interface ProfileHeaderProps {
    profile: Profile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();

    const handleEditSuccess = () => {
        router.refresh();
    };
    return (
        <div>
            <ProfileImageWithBackgroundImage
                profileImagePath={profile.image_path}
                backgroundImagePath={profile.background_image_path}
            />
            <div className="px-4 mt-2">
                <ProfileName name={profile.name} />
                <ProfileComment comment={profile.comment} />
                <EditProfileButton onClick={() => {
                    setIsEditModalOpen(true);
                }} className={'pt-3'} />
                <ProfileStatus
                    reviewCount={profile.reviews_count}
                    likedReviewsCount={profile.liked_reviews_count}
                />
            </div>

            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
}