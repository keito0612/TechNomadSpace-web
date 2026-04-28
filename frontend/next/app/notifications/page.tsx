import { cookies } from 'next/headers';
import { Suspense } from 'react';
import Layout from '@/components/Layout/Layout';
import NavBar from '@/components/Navbar';
import { AuthService } from '@/services/AuthService';
import { NotificationListResponse } from '@/types/types';
import NotificationList from '@/components/Notification/NotificationList';
import NotificationSkeleton from './skeleton';
import ErrorView from './error';

type NotificationResult =
    | { success: true; data: NotificationListResponse }
    | { success: false; isAuthError: boolean };

const getNotifications = async (
    token: string | undefined,
    page: number
): Promise<NotificationResult> => {
    try {
        if (!token) {
            return { success: false, isAuthError: true };
        }

        const res = await fetch(
            `${process.env.API_URL}/api/notifications?page=${page}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                cache: 'no-store',
            }
        );

        if (res.status === 401) {
            return { success: false, isAuthError: true };
        }

        if (!res.ok) {
            return { success: false, isAuthError: false };
        }

        const data = await res.json();
        return { success: true, data };
    } catch {
        return { success: false, isAuthError: false };
    }
};

const NotificationContent = async ({ page }: { page: number }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;

    const result = await getNotifications(token, page);

    if (!result.success) {
        return <ErrorView isAuthError={result.isAuthError} />;
    }

    return (
        <NotificationList
            initialNotifications={result.data.data}
            pagination={result.data.pagination}
            currentPage={page}
        />
    );
};

const NotificationsPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) => {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page || '1', 10));

    return (
        <Layout>
            <NavBar />
            <div className="max-w-5xl bg-black mx-auto w-full min-h-screen pt-16 px-4 pb-8">
                <Suspense fallback={<NotificationSkeleton />}>
                    <NotificationContent page={page} />
                </Suspense>
            </div>
        </Layout>
    );
};

export default NotificationsPage;
