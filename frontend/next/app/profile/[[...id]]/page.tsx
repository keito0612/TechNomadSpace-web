import { cookies } from 'next/headers';
import { Suspense } from 'react';
import Layout from '@/components/Layout/Layout';
import NavBar from '@/components/Navbar';
import ProfileReviewTabs from '@/components/Profile/ProfileReviewTabs';
import ProfileHeader from '@/components/Profile/ProfileHeader';
import { Profile } from '@/types/types';
import { AuthService } from '@/services/AuthService';

import { notFound } from 'next/navigation';
import ErrorView from './error';
import ProfileSkeleton from './skeleton';

type ProfileResult =
    | { success: true; profile: Profile }
    | { success: false; isAuthError: boolean; isNotFound?: false }
    | { success: false; isAuthError: false; isNotFound: true };

const getProfile = async (token: string | undefined, id: string | undefined): Promise<ProfileResult> => {
    try {
        const url = id !== undefined
            ? `${process.env.API_URL}/api/profile/${id}`
            : `${process.env.API_URL}/api/profile`;

        const headers: RequestInit["headers"] = id !== undefined ? {
            'Content-Type': 'application/json',
        } : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        }

        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
            cache: 'no-store',
        });

        if (res.status === 404) {
            return { success: false, isAuthError: false, isNotFound: true };
        }

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

const ProfileContent = async ({ id }: { id: string | undefined }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;

    const result = await getProfile(token, id);

    if (!result.success) {
        if ('isNotFound' in result && result.isNotFound) {
            notFound();
        }
        return <ErrorView isAuthError={result.isAuthError} />;
    }

    const isOwnProfile = id === undefined;

    return (
        <div className="max-w-5xl bg-black mx-auto w-full min-h-screen pt-16">
            <ProfileHeader profile={result.profile} isOwnProfile={isOwnProfile} />
            <div className="mt-4">
                <ProfileReviewTabs profile={result.profile} isOwnProfile={isOwnProfile} />
            </div>
        </div>
    );
};

const ProfilePage = async ({ params }: { params: Promise<{ id?: string[] }> }) => {
    const { id } = await params;
    const idValue = id?.[0];
    return (
        <Layout>
            <NavBar />
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent id={idValue} />
            </Suspense>
        </Layout>
    );
};

export default ProfilePage;