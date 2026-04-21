'use client';

import { useState, useEffect, useMemo } from 'react';
import Map from './Map';
import SearchBar from '@/components/SearchBar';
import FilterButtons from '@/components/FilterButtons';
import { LocationData } from '@/types/location';
import { cn } from '@/lib/utils';
import { LatLngExpression } from 'leaflet';
import { PriceType } from '@/types/types';

interface MapClientWrapperProps {
    locations: LocationData[];
}

// 東京のデフォルト座標
const TOKYO_POSITION: LatLngExpression = [35.6762, 139.6503];

export default function MapClientWrapper({ locations }: MapClientWrapperProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [currentPosition, setCurrentPosition] = useState<LatLngExpression>(TOKYO_POSITION);
    const [searchQuery, setSearchQuery] = useState('');
    const [flyToPosition, setFlyToPosition] = useState<LatLngExpression | null>(null);
    const [activeFilters, setActiveFilters] = useState<PriceType[]>([]);

    useEffect(() => {
        if (!navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition([position.coords.latitude, position.coords.longitude]);
            },
            () => {
                setCurrentPosition(TOKYO_POSITION);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, []);

    // 検索クエリとフィルターに基づいてロケーションをフィルタリング
    const filteredLocations = useMemo(() => {
        let result = locations;

        // フィルターで絞り込み
        if (activeFilters.length > 0) {
            result = result.filter(location =>
                activeFilters.includes(location.priceType)
            );
        }

        // 検索クエリで絞り込み
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(location =>
                location.name.toLowerCase().includes(query) ||
                location.address.toLowerCase().includes(query)
            );
        }

        return result;
    }, [locations, searchQuery, activeFilters]);

    const handleFilterChange = (filters: PriceType[]) => {
        setActiveFilters(filters);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (query.trim()) {
            const lowerQuery = query.toLowerCase();
            const matchedLocation = locations.find(location =>
                location.name.toLowerCase().includes(lowerQuery) ||
                location.address.toLowerCase().includes(lowerQuery)
            );

            if (matchedLocation) {
                setFlyToPosition(matchedLocation.position);
            }
        } else {
            setFlyToPosition(null);
        }
    };

    // flyToPosition をリセット（マップが移動した後）
    const handleFlyToComplete = () => {
        setFlyToPosition(null);
    };

    return (
        <>
            {/* 検索バーとフィルターボタン */}
            <div className={cn(
                "fixed top-[4.5rem] lg:top-[5.5rem] right-3 z-[1000] flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 transition-all duration-300",
                // シートが開いている場合は右にずらす（PC版のみ）
                isSheetOpen ? "left-3 lg:left-[calc(33.333%+1rem)]" : "left-3 lg:left-4"
            )}>
                <SearchBar
                    className="w-full lg:flex-1 lg:max-w-md"
                    onSearch={handleSearch}
                />
                <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide">
                    <FilterButtons
                        className="flex-nowrap"
                        onFilterChange={handleFilterChange}
                    />
                </div>
            </div>
            {/* マップ */}
            <div className="mt-14 lg:mt-16 pb-16 lg:pb-0 h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)] w-full">
                <Map
                    className="h-full w-full"
                    center={currentPosition}
                    locations={filteredLocations}
                    onSheetOpenChange={setIsSheetOpen}
                    flyTo={flyToPosition}
                    onFlyToComplete={handleFlyToComplete}
                />
            </div>
        </>
    );
}
