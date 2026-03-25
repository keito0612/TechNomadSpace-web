import { Amenity, OpeningHour, Photo, PriceType, Review } from "./types";

export interface LocationData {
    id: number;
    name: string;
    image: string;
    rating: number;
    address: string;
    phoneNumber: string;
    price: string;
    priceType: PriceType;
    photos: Photo[];
    websiteUrl: string | null;
    openingHours: OpeningHour[];
    amenity: Amenity;
    reviews: Review[];
    position: [number, number];
}
