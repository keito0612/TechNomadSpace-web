'use client';
import { Review } from '@/types/types';
import ReviewItem from '../Review/ReviewItem';
import ImageModal from '../Image/ImagesModal';
import Modal from '../Modal';
import { useState } from 'react';
import { LocationData } from '@/types/location';
import { PenSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/AuthService';


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
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const router = useRouter();

    const handlePhotoClick = (index: number) => {
        setSelectedIndex(index);
        setIsImageModalOpen(true);
    };

    const handleReviewClick = () => {
        const token = AuthService.getSesstion();
        if (token) {
            router.push(`/locations/${props.location.id}/review`);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleLoginNavigate = () => {
        router.push('/login');
    };

    return (
        <div className='w-full h-full pb-28'>
            <div className='px-4 py-3'>
                <button
                    onClick={handleReviewClick}
                    className='flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
                >
                    <PenSquare className='w-5 h-5' />
                    レビューを書く
                </button>
            </div>
            {
                props.reviews.length === 0 ? <NoReview /> : props.reviews.map((review) => <ReviewItem key={review.id} review={review} onImageClick={(index: number) => handlePhotoClick(index)} />)
            }
            <ImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                selectImageIndex={selectedIndex}
                title={props.location.name}
                images={props.location.photos}
            />
            <Modal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                title="ログインが必要です"
                message="レビューを書くにはログインが必要です。ログインしますか？"
                type="Warning"
                onConfirm={handleLoginNavigate}
                confirmLabel="ログインする"
                cancelLabel="キャンセル"
            />
        </div>
    )
}

export default ReviewBody;