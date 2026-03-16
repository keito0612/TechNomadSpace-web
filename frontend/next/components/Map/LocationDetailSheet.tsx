'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Monitor, Wifi, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LocationData } from '@/types/location';

interface LocationDetailSheetProps {
    location: LocationData | null;
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'info' | 'review' | 'photo';

export default function LocationDetailSheet({ location, isOpen, onClose }: LocationDetailSheetProps) {
    const [activeTab, setActiveTab] = useState<TabType>('info');

    if (!isOpen || !location) return null;

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            'h-5 w-5',
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-400'
                        )}
                    />
                ))}
                <span className="ml-2 text-white font-medium">{rating.toFixed(1)}/5.0</span>
            </div>
        );
    };

    const tabs: { key: TabType; label: string }[] = [
        { key: 'info', label: '情報' },
        { key: 'review', label: 'レビュー' },
        { key: 'photo', label: '写真' },
    ];

    return (
        <div className={cn(
            "fixed z-[1000] bg-gray-900 flex flex-col",
            // モバイル: ボトムシート
            "inset-x-0 bottom-0 max-h-[70vh] rounded-t-3xl animate-in slide-in-from-bottom duration-300",
            // PC: 左サイドパネル
            "lg:inset-y-0 lg:left-0 lg:right-auto lg:top-16 lg:bottom-0 lg:w-1/3 lg:max-h-none lg:rounded-none lg:rounded-r-2xl lg:animate-in lg:slide-in-from-left"
        )}>
            {/* 閉じるボタン */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
                <X className="h-5 w-5 text-white" />
            </button>

            {/* 画像 */}
            <div className="relative h-48 w-full shrink-0">
                <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                    <h2 className="text-xl font-bold text-white">{location.name}</h2>
                </div>
            </div>

            {/* 評価 */}
            <div className="px-4 py-3 border-b border-gray-700 shrink-0">
                {renderStars(location.rating)}
            </div>

            {/* タブ */}
            <div className="flex border-b border-gray-700 shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
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

            {/* コンテンツ */}
            <div className="p-4 overflow-y-auto flex-1">
                {activeTab === 'info' && (
                    <div className="space-y-3 text-sm">
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
                )}

                {activeTab === 'review' && (
                    <div className="text-gray-400 text-center py-8">
                        レビューはまだありません
                    </div>
                )}

                {activeTab === 'photo' && (
                    <div className="text-gray-400 text-center py-8">
                        写真はまだありません
                    </div>
                )}
            </div>

            {/* アメニティボタン */}
            <div className="p-4 border-t border-gray-700 flex gap-3 shrink-0">
                {location.amenities.includes('monitor') && (
                    <Button
                        variant="outline"
                        className="flex-1 rounded-xl border-blue-500 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    >
                        <Monitor className="mr-2 h-4 w-4" />
                        モニター
                    </Button>
                )}
                {location.amenities.includes('wifi') && (
                    <Button
                        variant="outline"
                        className="flex-1 rounded-xl border-blue-500 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    >
                        <Wifi className="mr-2 h-4 w-4" />
                        Wifi
                    </Button>
                )}
            </div>
        </div>
    );
}
