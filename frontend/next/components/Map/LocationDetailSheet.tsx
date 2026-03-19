'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Monitor, Wifi, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LocationData } from '@/types/location';
import StarsRatings from '../StarsRating';
import { Amenity } from '@/types/types';

interface LocationDetailSheetProps {
    location: LocationData | null;
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'info' | 'review' | 'photo';


const CloseButton = ({ onClose }: { onClose: () => void }) => {
    return (
        <Button
            onClick={onClose}
            className="absolute top-1 right-1 z-10 h-9 w-9 border-blue-800 border-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
            <X className="h-5 w-5 text-white" />
        </Button>
    );
}

const Tabs = ({ tabs, activeTab, onClick }: { tabs: { key: TabType; label: string }[], activeTab: TabType, onClick: (tabKey: TabType) => void }) => {
    return (
        <div className="flex border-b border-gray-700 shrink-0">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onClick(tab.key)}
                    className={cn(
                        'flex-1 py-3 text-center font-medium transition-colors',
                        activeTab === tab.key
                            ? 'text-white border-b-2 border-blue-500'
                            : 'text-gray-400 hover:text-white'
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

const ImageSection = ({ location, onClose }: { location: LocationData; onClose: () => void }) => {
    return (
        <div className="relative h-48 w-full shrink-0">
            <Image
                src={location.image}
                alt={location.name}
                fill
                className="object-cover"
            />
            {/* 閉じるボタン - 画像の右上 */}
            <CloseButton onClose={onClose} />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                <h2 className="text-xl font-bold text-white">{location.name}</h2>
            </div>
        </div>
    );
}

const AmenityStatus = ({ amenity }: { amenity: Amenity }) => {
    return (
        <div className="p-3 border-gray-700 flex gap-3 shrink-0">
            <Button
                variant="outline"
                className="flex-1 rounded-xl border-blue-500 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            >
                <Monitor className="mr-2 h-4 w-4" />
                モニター
            </Button>

            {amenity.hasWifi === true && (
                <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-blue-500 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                >
                    <Wifi className="mr-2 h-4 w-4" />
                    Wifi
                </Button>
            )}
        </div>
    );
}

const LocationInformation = ({ location, className }: { location: LocationData, className: string }) => {
    return (
        <div className={cn("space-y-3 text-sm", className)}>
            <div className="flex">
                <span className="text-gray-400 w-20 shrink-0">住所</span>
                <span className="text-white">{location.address}</span>
            </div>
            <div className="flex">
                <span className="text-gray-400 w-20 shrink-0">電話番号</span>
                <span className="text-white">{location.phone}</span>
            </div>
            <div className="flex">
                <span className="text-gray-400 w-20 shrink-0">金額</span>
                <span className="text-white">{location.price}</span>
            </div>
            <div className="flex">
                <span className="text-gray-400 w-20 shrink-0">定休日</span>
                <span className="text-white">{location.closedDay}</span>
            </div>
            <div className="flex">
                <span className="text-gray-400 w-20 shrink-0">営業時間</span>
                <span className="text-white">{location.hours}</span>
            </div>
        </div>
    );
}

export default function LocationDetailSheet({ location, isOpen, onClose }: LocationDetailSheetProps) {
    const [activeTab, setActiveTab] = useState<TabType>('info');

    if (!isOpen || !location) return null;

    const tabs: { key: TabType; label: string }[] = [
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
                "fixed z-[1000] bg-black flex flex-col",
                // モバイル: ボトムシート
                "inset-x-0 bottom-0 max-h-[80vh] rounded-t-3xl animate-in slide-in-from-bottom duration-300",
                // PC: 左サイドパネル
                "lg:inset-y-0 lg:left-0 lg:right-auto lg:top-16 lg:bottom-0 lg:w-1/3 lg:max-h-none lg:rounded-none lg:rounded-r-2xl lg:animate-in lg:slide-in-from-left"
            )}>
                <Tabs tabs={tabs} activeTab={activeTab} onClick={setActiveTab} />

                {/* 画像 */}
                <ImageSection location={location} onClose={onClose} />
                <StarsRatings className='pl-3 pt-3' rating={location.rating} size={24} />
                <LocationInformation location={location} className={'px-3 py-2'} />
                <AmenityStatus amenity={location.amenity} />
            </div>
        </>
    );
}
