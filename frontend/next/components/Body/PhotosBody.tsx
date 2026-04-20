'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Photo } from '@/types/types';
import { Loader2 } from 'lucide-react';
import ImageModal from '../Image/ImagesModal';

interface PhotosBodyProps {
    photos: Photo[];
}

// ローディングスピナー
const LoadingSpinner = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
    );
};

// 写真グリッドアイテム
const PhotoGridItem = ({
    photo,
    onClick,
}: {
    photo: Photo;
    onClick: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={onClick}
        >
            {isLoading && <LoadingSpinner />}
            <Image
                unoptimized
                src={photo.photoUrl}
                alt={photo.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

// 写真グリッド
const PhotoGrid = ({
    photos,
    onPhotoClick,
}: {
    photos: Photo[];
    onPhotoClick: (index: number) => void;
}) => {
    if (photos.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-400">
                写真がありません
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-1 p-2">
            {photos.map((photo, index) => (
                <PhotoGridItem
                    key={photo.id}
                    photo={photo}
                    onClick={() => onPhotoClick(index)}
                />
            ))}
        </div>
    );
};

// メインコンポーネント
export const PhotosBody = ({ photos }: PhotosBodyProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handlePhotoClick = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    return (
        <>
            <PhotoGrid photos={photos} onPhotoClick={handlePhotoClick} />
            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectImageIndex={selectedIndex}
                title="写真"
                images={photos}
            />
        </>
    );
};

export default PhotosBody;
