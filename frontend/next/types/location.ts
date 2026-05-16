import { Amenity, OpeningHour, Photo, PriceType, Review } from "./types";

export interface LocationData {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    priceType: PriceType;
    websiteUrl: string | null;
    thumbnailImagePath: string | null;
    photos: Photo[];
    rating: number;
    openingHours: OpeningHour[];
    amenity: Amenity;
    reviews: Review[];
    position: [number, number];
    isFavorited: boolean;
    price?: string;
}
