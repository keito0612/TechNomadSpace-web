import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import Layout from '@/components/Layout/Layout';
import NavBar from '@/components/Navbar';
import ProfileImage from '@/components/Profile/ProfileImage';
import ProfileReviewTabs from '@/components/Profile/ProfileReviewTabs';
import AuthErrorView from '@/components/Profile/AuthErrorView';
import { Profile } from '@/types/types';
import { AuthService } from '@/services/AuthService';
import ErrorView from './error';
import ProfileSkeleton from './skeleton';
import Image from 'next/image';
import { Camera } from 'lucide-react';

type ProfileResult =
    | { success: true; profile: Profile }
    | { success: false; isAuthError: boolean };

const getProfile = async (token: string): Promise<ProfileResult> => {
    try {
        const res = await fetch(`${process.env.API_URL}/api/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (res.status === 401) {
            return { success: false, isAuthError: true };
        }

        if (!res.ok) {
            return { success: false, isAuthError: false };
        }

        const data = await res.json();
        const profile = data.profile;

        if (!profile) {
            return { success: false, isAuthError: false };
        }

        return { success: true, profile };
    } catch {
        return { success: false, isAuthError: false };
    }
};


const BackgroundImage = ({ imagePath }: { imagePath: string | null }) => {
    return (
        <div className="relative w-full h-36 bg-gray-700">
            {imagePath ? (
                <Image
                    src={imagePath}
                    alt="背景画像"
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-gray-500" />
                </div>
            )}
        </div>
    );
}


const ProfileImageWithBackgroundImage = ({
    profileImagePath,
    backgroundImagePath,
}: {
    profileImagePath: string | null;
    backgroundImagePath: string | null;
}) => {
    return (
        <div className="w-full">
            <BackgroundImage imagePath={backgroundImagePath} />
            <div className="px-4">
                <div className="-mt-10">
                    <ProfileImage imageUrl={profileImagePath} sizes={80} />
                </div>
            </div>
        </div>
    );
}

const ProfileStatus = ({ reviewCount, likedReviewsCount }: { reviewCount: number, likedReviewsCount: number }) => {
    return (
        <div className="flex gap-4 mt-3 text-sm text-gray-300">
            <span>{reviewCount} レビュー</span>
            <span>{likedReviewsCount} いいね</span>
        </div>
    );
}

const ProfileComment = ({ comment }: { comment: string }) => {
    return (
        comment && (
            <p className="mt-2 text-sm text-gray-300 break-words line-clamp-4">
                {comment}
            </p>
        )
    );
}

const ProfileHeader = ({ profile }: { profile: Profile }) => {
    return (
        <div>
            <ProfileImageWithBackgroundImage
                profileImagePath={profile.image_path}
                backgroundImagePath={null}
            />
            <div className="px-4 mt-2">
                <h1 className="text-lg font-bold text-white break-words">
                    {profile.name}
                </h1>
                <ProfileComment comment={profile.comment} />
                <ProfileStatus
                    reviewCount={profile.reviews_count}
                    likedReviewsCount={profile.liked_reviews_count}
                />
            </div>
        </div>
    );
};

const ProfileContent = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;

    if (!token) {
        redirect('/');
    }

    const result = await getProfile(token);

    if (!result.success) {
        if (result.isAuthError) {
            return <AuthErrorView />;
        }
        return <ErrorView isAuthError={result.isAuthError} />;
    }

    return (
        <div className="max-w-2xl bg-black mx-auto w-full min-h-screen pt-16">
            <ProfileHeader profile={result.profile} />
            <div className="mt-4">
                <ProfileReviewTabs profile={result.profile} />
            </div>
        </div>
    );
};

const ProfilePage = () => {
    return (
        <Layout>
            <NavBar onBack />
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent />
            </Suspense>
        </Layout>
    );
};

export default ProfilePage;
