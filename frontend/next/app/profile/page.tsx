import { cookies } from 'next/headers';
import { Suspense } from 'react';
import Layout from '@/components/Layout/Layout';
import NavBar from '@/components/Navbar';
import ProfileReviewTabs from '@/components/Profile/ProfileReviewTabs';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import { Profile } from '@/types/types';
import { AuthService } from '@/services/AuthService';
import ErrorView from './error';
import ProfileSkeleton from './skeleton';

type ProfileResult =
    | { success: true; profile: Profile }
    | { success: false; isAuthError: boolean };

const getProfile = async (token: string | undefined): Promise<ProfileResult> => {
    try {
        const res = await fetch(`${process.env.API_URL}/api/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });
        if (res.status === 401) {
            return { success: false, isAuthError: true };
        }

        if (!res.ok) {
            return { success: false, isAuthError: false };
        }

        const json = await res.json();
        const profile = json.data;
        if (!profile) {
            return { success: false, isAuthError: false };
        }

        return { success: true, profile };
    } catch {
        return { success: false, isAuthError: false };
    }
};

const ProfileContent = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;

    const result = await getProfile(token);

    if (!result.success) {
        return <ErrorView isAuthError={result.isAuthError} />;
    }

    return (
        <div className="max-w-5xl bg-black mx-auto w-full min-h-screen pt-16">
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
            <NavBar />
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent />
            </Suspense>
        </Layout>
    );
};

export default ProfilePage;
