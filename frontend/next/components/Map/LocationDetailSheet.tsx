import { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LocationData } from '@/types/location';
import StarsRatings from '../StarsRating';
import { Amenity, LocationTabType } from '@/types/types';
import InformationBody from '../Body/InformationBody';
import TabsContainer from '../TabsContainer';
import ReviewBody from '../Body/ReviewBody';
import { PhotosBody } from '../Body/PhotosBody';

interface LocationDetailSheetProps {
    location: LocationData | null;
    isOpen: boolean;
    onClose: () => void;
}

const CloseButton = ({ onClose }: { onClose: () => void }) => {
    return (
        <Button
            onClick={onClose}
            className="h-6 w-6 border-blue-800 border-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
            <X className="h-5 w-5 text-blue-800" />
        </Button>
    );
}

const SheetHeader = ({ name, onClose }: { name: string, onClose: () => void }) => {
    return (
        <div className='relative flex flex-row justify-center items-center mt-2 px-4'>
            <div className='font-bold text-white text-center'>
                {name}
            </div>
            <div className='absolute right-4'>
                <CloseButton onClose={onClose} />
            </div>
        </div>
    );
}

export default function LocationDetailSheet({ location, isOpen, onClose }: LocationDetailSheetProps) {
    // モーダルが開いている時はページ全体のスクロールを無効化
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !location) return null;
    const tabs: { key: LocationTabType; label: string }[] = [
        { key: 'info', label: '情報' },
        { key: 'review', label: 'レビュー' },
        { key: 'photo', label: '写真' },
    ];

    return (
        <>
            {/* モバイル用オーバーレイ */}
            <div
                className="fixed inset-0 z-[999] bg-black/50 lg:hidden animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* モーダル本体 */}
            <div className={cn(
                "fixed z-[1000] bg-black flex flex-col overflow-hidden",
                // モバイル: ボトムシート
                "inset-x-0 bottom-0 h-[80vh] max-h-[80vh] rounded-t-3xl animate-in slide-in-from-bottom duration-300",
                // PC: 左サイドパネル
                "lg:inset-y-0 lg:left-0 lg:right-auto lg:top-16 lg:bottom-0 lg:w-1/3 lg:h-auto lg:max-h-none lg:rounded-none lg:rounded-r-2xl lg:animate-in lg:slide-in-from-left"
            )}>
                <SheetHeader name={location.name} onClose={onClose} />
                <div className="flex-1 min-h-0 overflow-hidden">
                    <TabsContainer defalutValue={'info'} tabs={tabs} bodys={[<InformationBody key='info' location={location} />, <ReviewBody key='review' reviews={location.reviews} />, <PhotosBody key='photo' photos={location.photos} />]} />
                </div>
            </div>
        </>
    );
}
