'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, User, Loader2 } from 'lucide-react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface BackgroundImagePickerProps {
    preview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    register: Omit<UseFormRegisterReturn, 'ref'>;
    registerRef: (e: HTMLInputElement | null) => void;
    error?: string;
}

interface ProfileImagePickerProps {
    preview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    register: Omit<UseFormRegisterReturn, 'ref'>;
    registerRef: (e: HTMLInputElement | null) => void;
    error?: string;
}

interface ProfileImageSectionProps {
    backgroundImage: BackgroundImagePickerProps;
    profileImage: ProfileImagePickerProps;
}

export default function ProfileImageSection({
    backgroundImage,
    profileImage,
}: ProfileImageSectionProps) {
    const backgroundImageInputRef = useRef<HTMLInputElement>(null);
    const profileImageInputRef = useRef<HTMLInputElement>(null);
    const [isBackgroundLoading, setIsBackgroundLoading] = useState(true);
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    return (
        <>
            <div className="relative">
                {/* 背景画像 */}
                <div
                    className="relative w-full h-32 bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => backgroundImageInputRef.current?.click()}
                >
                    {backgroundImage.preview ? (
                        <>
                            {isBackgroundLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-700 z-10">
                                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                                </div>
                            )}
                            <Image
                                src={backgroundImage.preview}
                                alt="背景画像プレビュー"
                                fill
                                unoptimized
                                className="object-cover"
                                onLoad={() => setIsBackgroundLoading(false)}
                            />
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-500" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                    {...backgroundImage.register}
                    ref={(e) => {
                        backgroundImage.registerRef(e);
                        backgroundImageInputRef.current = e;
                    }}
                    onChange={(e) => {
                        setIsBackgroundLoading(true);
                        backgroundImage.onImageChange(e);
                    }}
                />
                {/* プロフィール画像 */}
                <div className="absolute -bottom-8 left-4">
                    <div
                        className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-background cursor-pointer"
                        onClick={() => profileImageInputRef.current?.click()}
                    >
                        {profileImage.preview ? (
                            <>
                                {isProfileLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
                                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                                    </div>
                                )}
                                <Image
                                    src={profileImage.preview}
                                    alt="プロフィール画像プレビュー"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    onLoad={() => setIsProfileLoading(false)}
                                />
                            </>
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <User className="w-10 h-10 text-gray-500" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                    {...profileImage.register}
                    ref={(e) => {
                        profileImage.registerRef(e);
                        profileImageInputRef.current = e;
                    }}
                    onChange={(e) => {
                        setIsProfileLoading(true);
                        profileImage.onImageChange(e);
                    }}
                />
            </div>
            {(profileImage.error || backgroundImage.error) && (
                <p className="text-red-500 text-sm mt-10">
                    {profileImage.error || backgroundImage.error}
                </p>
            )}
        </>
    );
}
