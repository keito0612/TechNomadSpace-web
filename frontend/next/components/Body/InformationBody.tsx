'use client';

import { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { LocationData } from '@/types/location';
import Image from 'next/image';
import { Amenity, OpeningHour } from '@/types/types';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Coffee, DoorClosed, LucideProps, Monitor, Plug, Wifi } from 'lucide-react';
import StarsRatings from '../StarsRating';
import Link from 'next/link';
import { getAllHours } from '@/utils/openingHour';
import ImageModal from '../Image/ImagesModal';
import FavoriteButton from '../FavoriteButton';

interface InformationBodyProps {
    location: LocationData;
}


const ImageSection = ({
    location,
    onImageClick,
}: {
    location: LocationData;
    onImageClick: () => void;
}) => {
    const imageUrl = location.thumbnailImagePath;
    const imageAlt = location.name;

    if (!imageUrl) {
        return (
            <div className="relative h-48 w-full shrink-0 bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500">画像なし</span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                    <h2 className="text-xl font-bold text-white">{location.name}</h2>
                </div>
            </div>
        );
    }

    return (
        <div
            className="relative h-48 w-full shrink-0 cursor-pointer"
            onClick={onImageClick}
        >
            <Image
                src={imageUrl}
                alt={imageAlt}
                unoptimized
                fill
                className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                <h2 className="text-xl font-bold text-white">{location.name}</h2>
            </div>
        </div>
    );
}

const AmenityStatusConteiner = ({ hasStatus, name, icon }: { hasStatus: boolean, name: string, icon: React.ReactNode }) => {
    return (
        <div
            className={cn("flex-1 rounded-xl inline-flex items-center justify-center h-8 gap-1.5 px-2.5 text-sm font-medium border", hasStatus === true ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-gray-800 bg-gray-900 text-black')}>
            {icon}
            {name}
        </div>
    );
}

const AmenityStatus = ({ amenity }: { amenity: Amenity }) => {
    return (
        <div className="lg:pt-5 p-3 border-gray-700 grid grid-cols-2 gap-3 shrink-0">
            <AmenityStatusConteiner hasStatus={amenity.hasMonitor} name={'モニター'} icon={<Monitor className="mr-2 h-4 w-4" />} />
            <AmenityStatusConteiner hasStatus={amenity.hasWifi} name={'Wifi'} icon={<Wifi className="mr-2 h-4 w-4" />} />
            <AmenityStatusConteiner hasStatus={amenity.hasPrivateBooth} name={'個室ブース'} icon={<DoorClosed className="mr-2 h-4 w-4" />} />
            <AmenityStatusConteiner hasStatus={amenity.hasPower} name={'電源'} icon={<Plug className="mr-2 h-4 w-4" />} />
            <AmenityStatusConteiner hasStatus={amenity.hasFreeDrink} name={'フリードリンク'} icon={<Coffee className="mr-2 h-4 w-4" />} />
        </div >
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='lg:pb-0 pb-24'>
            <ImageSection
                location={props.location}
                onImageClick={() => setIsModalOpen(true)}
            />
            <div className="flex items-center justify-between px-3 pt-3">
                <StarsRatings rating={props.location.rating} size={24} />
                <FavoriteButton
                    locationId={props.location.id}
                    initialIsFavorited={props.location.isFavorited}
                />
            </div>
            <LocationInformation location={props.location} className={'px-3 py-2'} />
            <AmenityStatus amenity={props.location.amenity} />

            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectImageIndex={0}
                title={props.location.name}
                images={props.location.photos}
            />
        </div>
    )
}

export default InformationBody;
