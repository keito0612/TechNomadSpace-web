import { Amenity, PriceType } from "./types";

export interface LocationData {
    id: number;
    name: string;
    image: string;
    rating: number;
    address: string;
    phone: string;
    price: string;
    priceType: PriceType;
    closedDay: string;
    hours: string;
    amenity: Amenity;
    position: [number, number];
}
