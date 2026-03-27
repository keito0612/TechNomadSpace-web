'use client';

import { useState, useEffect } from 'react';
import Map from './Map';
import SearchBar from '@/components/SearchBar';
import FilterButtons from '@/components/FilterButtons';
import { LocationData } from '@/types/location';
import { cn } from '@/lib/utils';
import { LatLngExpression } from 'leaflet';

interface MapClientWrapperProps {
    locations: LocationData[];
}

// 東京のデフォルト座標
const TOKYO_POSITION: LatLngExpression = [35.6762, 139.6503];

export default function MapClientWrapper({ locations }: MapClientWrapperProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [currentPosition, setCurrentPosition] = useState<LatLngExpression>(TOKYO_POSITION);

    useEffect(() => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition([position.coords.latitude, position.coords.longitude]);
            },
            () => {
                // 位置情報の取得に失敗した場合はデフォルトの東京を維持
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, []);

    return (
        <>
            {/* 検索バーとフィルターボタン */}
            <div className={cn(
                "fixed top-[4.5rem] lg:top-[5.5rem] right-3 z-[1000] flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all duration-300",
                // シートが開いている場合は右にずらす（PC版のみ）
                isSheetOpen ? "left-3 lg:left-[calc(33.333%+1rem)]" : "left-3 lg:left-4"
            )}>
                <SearchBar className="w-full lg:flex-1 lg:max-w-md" />
                <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
                    <FilterButtons className="flex-nowrap" />
                </div>
            </div>
            {/* マップ */}
            <div className="mt-14 lg:mt-16 pb-16 lg:pb-0 h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)] w-full">
                <Map
                    className="h-full w-full"
                    center={currentPosition}
                    locations={locations}
                    onSheetOpenChange={setIsSheetOpen}
                />
            </div>
        </>
    );
}
