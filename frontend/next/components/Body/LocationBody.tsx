'use client'
import { LocationData } from "@/types/location";
import { Layout } from "lucide-react";
import NavBar from "../Navbar";
import TabsContainer from "../TabsContainer";
import InformationBody from "./InformationBody";
import ReviewBody from "./ReviewBody";
import PhotosBody from "./PhotosBody";
import { LocationTabType } from "@/types/types";

interface LocationBodyProps {
    location: LocationData;
}

export default function LocationBody({ location }: LocationBodyProps) {
    const tabs: {
        key: LocationTabType;
        label: string;
    }[] = [
            {
                key: 'info',
                label: '情報'
            },
            {
                key: 'review',
                label: 'レビュー',
            },
            {
                key: 'photo',
                label: '写真'
            }
        ];
    return (
        <div className="max-w-5xl mx-auto w-full min-h-screen bg-black pt-20 ">
            <TabsContainer defalutValue={'info'} tabs={tabs} bodys={[<InformationBody key='info' location={location} />, <ReviewBody key='review' location={location} reviews={location.reviews} />, <PhotosBody key='photo' photos={location.photos} />]} />
        </div>
    );
}