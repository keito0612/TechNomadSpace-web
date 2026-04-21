"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import Image from "next/image";

interface LocationSectionProps {
    name: string;
    imagePath?: string;
}

const NoLocationImage = () => {
    return (
        <div className="flex justify-center items-center rounded-full border border-blue-700 w-14 h-14 md:w-20 md:h-20 lg:h-24 lg:w-24 bg-black">
            <MapPin className="text-blue-700 size-8 md:size-12" />
        </div>
    );
};

const LocationImage = ({ imagePath, alt }: { imagePath: string; alt: string }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-14 h-14 md:w-20 md:h-20 lg:h-24 lg:w-24 relative rounded-full overflow-hidden border border-blue-700 shadow-md shrink-0">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                    <Loader2 className="text-blue-800 w-2/5 h-2/5 animate-spin" />
                </div>
            )}
            <Image
                unoptimized={process.env.NODE_ENV === 'development'}
                src={imagePath}
                alt={alt}
                fill
                className="object-cover"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

export default function LocationSection({ name, imagePath }: LocationSectionProps) {
    return (
        <div className="flex justify-start items-center gap-2 md:gap-3 lg:gap-3">
            <div className="shrink-0">
                {imagePath ? (
                    <LocationImage imagePath={imagePath} alt={name} />
                ) : (
                    <NoLocationImage />
                )}
            </div>
            <p className="text-sm md:text-2xl lg:text-2xl text-white mb-2 font-bold">
                {name}
            </p>
        </div>
    );
}
