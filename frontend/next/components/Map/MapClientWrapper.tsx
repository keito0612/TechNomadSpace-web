'use client';

import { useState } from 'react';
import Map from './Map';
import SearchBar from '@/components/SearchBar';
import FilterButtons from '@/components/FilterButtons';
import { LocationData } from '@/types/location';
import { cn } from '@/lib/utils';

interface MapClientWrapperProps {
    locations: LocationData[];
}

export default function MapClientWrapper({ locations }: MapClientWrapperProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <>
            {/* 検索バーとフィルターボタン */}
            <div className={cn(
                "fixed top-[4.5rem] lg:top-[5.5rem] right-3 z-[1000] flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all duration-300",
                // シートが開いている場合は右にずらす（PC版のみ）
                isSheetOpen ? "left-3 lg:left-[calc(37.333%+7rem)]" : "left-3 lg:left-4"
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
                    locations={locations}
                    onSheetOpenChange={setIsSheetOpen}
                />
            </div>
        </>
    );
}
