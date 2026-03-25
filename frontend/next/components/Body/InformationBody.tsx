'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LocationData } from '@/types/location';
import Image from 'next/image';
import { Amenity, OpeningHour } from '@/types/types';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Monitor, Wifi } from 'lucide-react';
import StarsRatings from '../StarsRating';
import Link from 'next/link';
import { getAllHours } from '@/utils/openingHour';

interface InformationBodyProps {
    location: LocationData;
}


const ImageSection = ({ location }: { location: LocationData }) => {
    const firstPhoto = location.photos[0];
    return (
        <div className="relative h-48 w-full shrink-0">
            <Image
                src={firstPhoto.photoUrl}
                alt={firstPhoto.name}
                fill
                className="object-cover"
            />
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

const InformationItem = ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="flex">
            <span className="text-gray-400 w-20 shrink-0">{title}</span>
            {children}
        </div>
    );
}

const OpeningHoursCollapsible = ({ openingHours }: { openingHours: OpeningHour[] }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hours = getAllHours(openingHours);
    const todayHours = hours[0]; // 今日が最初に来る

    return (
        <div className="text-white flex flex-col gap-1">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-left"
            >
                <span className="w-12 text-blue-700">{todayHours?.day}</span>
                <span className="text-blue-700">{todayHours?.hours}</span>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
            </button>
            {isExpanded && hours.slice(1).map((item, index) => (
                <div key={index} className="flex gap-2">
                    <span className="w-12">{item.day}</span>
                    <span>{item.hours}</span>
                </div>
            ))}
        </div>
    );
}

const LocationInformation = ({ location, className }: { location: LocationData, className: string }) => {
    return (
        <div className={cn("space-y-3 text-sm", className)}>
            <InformationItem title={'住所'}>
                <span className="text-white">{location.address}</span>
            </InformationItem>
            <InformationItem title={'電話番号'}>
                <span className="text-white">{location.phoneNumber}</span>
            </InformationItem>
            <InformationItem title={'金額'}>
                <span className="text-white">{location.price}</span>
            </InformationItem>
            <InformationItem title={'営業時間'}>
                <OpeningHoursCollapsible openingHours={location.openingHours} />
            </InformationItem>
            <InformationItem title={'URL'}>
                {
                    location.websiteUrl !== null ? <Link href={location.websiteUrl}>
                        <span className='text-blue-600'>
                            {location.websiteUrl}
                        </span></Link> : null
                }
            </InformationItem>
        </div >
    );
}
export const InformationBody = (props: InformationBodyProps) => {
    return (
        <>
            <ImageSection location={props.location} />
            <StarsRatings className='pl-3 pt-3' rating={props.location.rating} size={24} />
            <LocationInformation location={props.location} className={'px-3 py-2 pb-11 lg:pb-0'} />
            <AmenityStatus amenity={props.location.amenity} />
        </>
    )
}

export default InformationBody;