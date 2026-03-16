"use client";
import Image from "next/image";
import { User } from "lucide-react";

interface ProfileImageProps {
    imageUrl: string | null;
    sizes?: number; // 基準サイズ（px）
}

export function ProfileImage({ imageUrl, sizes = 100 }: ProfileImageProps) {
    // 最小 40px、最大 sizes px、中央は 10vw（適度に伸縮）
    const responsiveSize = `clamp(${sizes - 10}px, 10vw, ${sizes}px)`;

    const isValidSrc = typeof imageUrl === "string" && imageUrl.trim() !== "";

    return (
        <div
            className="relative rounded-full overflow-hidden ring-2 ring-white shadow-md"
            style={{ width: responsiveSize, height: responsiveSize }}
        >
            {isValidSrc ? (
                <Image
                    unoptimized
                    src={imageUrl}
                    alt="プロフィール写真"
                    fill
                    className="object-cover rounded-full"
                />
            ) : (
                <div className="w-full h-full bg-green-50 rounded-full flex items-center justify-center">
                    <User
                        className="text-green-500 w-[70%] h-[70%]"
                    />
                </div>
            )}
        </div>
    );
}

export default ProfileImage;

