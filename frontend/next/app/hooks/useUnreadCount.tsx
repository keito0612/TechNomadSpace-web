import { AuthService } from '@/services/AuthService';
import useSWR from 'swr';


async function fetcher(url: string): Promise<{ unread_count: number }> {
    const token = AuthService.getSesstion();
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch unread count');
    }

    return res.json();
}

export function useUnreadCount() {
    const { data, error, isLoading } = useSWR<{ unread_count: number }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/unread_count`,
        fetcher,
        {
            refreshInterval: 30_000,
        },
    );

    return {
        count: data?.unread_count ?? 0,
        isLoading,
        isError: !!error,
    };
}