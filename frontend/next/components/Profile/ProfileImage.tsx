'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Loader2 } from 'lucide-react';

interface ProfileImageProps {
    imageUrl?: string | null;
    sizes?: number;
}

const ProfileImage = ({ imageUrl, sizes = 100 }: ProfileImageProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const minSize = Math.max(sizes - 10, 30);
    const responsiveSize = `clamp(${minSize}px, 10vw, ${sizes}px)`;

    const isValidSrc = !!imageUrl && imageUrl.trim() !== '';

    return (
        <div
            className="relative rounded-full overflow-hidden border-2 border-blue-700 shadow-md shrink-0"
            style={{ width: responsiveSize, height: responsiveSize }}
        >
            {isValidSrc ? (
                <>
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                            <Loader2 className="text-blue-800 w-2/5 h-2/5 animate-spin" />
                        </div>
                    )}
                    <Image
                        unoptimized
                        src={imageUrl}
                        alt="プロフィール写真"
                        fill
                        className="object-cover"
                        onLoad={() => setIsLoading(false)}
                    />
                </>
            ) : (
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <User className="text-blue-800 w-3/5 h-3/5" />
                </div>
            )}
        </div>
    );
};

export default ProfileImage;
