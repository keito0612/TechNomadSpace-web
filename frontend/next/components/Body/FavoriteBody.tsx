'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Loader2 } from 'lucide-react';
import { LocationData } from '@/types/location';
import StarsRatings from '../StarsRating';
import SearchBar from '../SearchBar';
import { useRouter } from 'next/navigation';
import FavoriteButton from '../FavoriteButton';

interface FavoriteBodyProps {
    locations: LocationData[];
}

const NoFavorite = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <Heart className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-xl font-bold text-gray-300 mb-2">
                お気に入りがありません
            </p>
            <p className="text-sm text-gray-500 text-center">
                気になるコアーキングスペースを見つけたら、ハートをタップしてお気に入りに追加しましょう
            </p>
        </div>
    );
};

const FavoriteItemImage = ({ imagePath, name }: { imagePath: string; name: string }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-700">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700 z-10">
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
            )}
            <Image
                src={imagePath}
                alt={name}
                fill
                unoptimized
                className="object-cover"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};
const FavoriteItem = ({ location }: { location: LocationData }) => {
    return (
        <Link href={`/location/${location.id}`}>
            <div className="flex gap-3 p-3 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors">
                {location.image ? (
                    <FavoriteItemImage imagePath={location.image} name={location.name} />
                ) : (
                    <div className="w-24 h-24 shrink-0 rounded-lg bg-gray-700 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-gray-500" />
                    </div>
                )}
                <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
                    <h3 className="font-bold text-white text-base truncate">
                        {location.name}
                    </h3>
                    <StarsRatings size={16} rating={location.rating} />
                    <p className="text-sm text-gray-400 truncate">
                        {location.price}
                    </p>
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {location.address}
                    </p>
                </div>
                <div className="flex items-center" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}>
                    <FavoriteButton locationId={location.id} initialIsFavorited={location.isFavorited ?? true} />
                </div>
            </div>
        </Link>
    );
};

const FavoriteList = ({ locations }: { locations: LocationData[] }) => {
    return (
        <div className="flex flex-col gap-3">
            {locations.map((location) => (
                <FavoriteItem key={location.id} location={location} />
            ))}
        </div>
    );
};

const FavoriteBody = ({ locations }: FavoriteBodyProps) => {
    const hasLocations = Array.isArray(locations) && locations.length > 0;
    const router = useRouter()

    const search = async (query: string) => {
        router.replace(`/favorite/?keyword=${query.trim()}`);
    }

    return (
        <div className="max-w-5xl mx-auto w-full min-h-screen bg-black">
            <div className="sticky top-12 z-20 bg-black px-4 pt-4 pb-2">
                <SearchBar placeholder='お気に入りのコアーキングスペースを検索' onSearch={search} />
            </div>
            <div className="px-4 pt-14 pb-4">
                {hasLocations ? (
                    <FavoriteList locations={locations} />
                ) : (
                    <NoFavorite />
                )}
            </div>
        </div>
    );
};

export default FavoriteBody;
