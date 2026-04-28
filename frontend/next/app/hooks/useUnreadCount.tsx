import { AuthService } from '@/services/AuthService';
import { useSyncExternalStore } from 'react';
import useSWR from 'swr';

async function fetcher(url: string): Promise<{ unread_count: number }> {
    const token = AuthService.getSesstion();
    if (!token) throw new Error('No token');

    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error('Failed to fetch unread count');
    return res.json();
}


const subscribe = () => () => { };

export function useUnreadCount() {
    const token = useSyncExternalStore(
        subscribe,
        () => AuthService.getSesstion(),
        () => null
    );

    const { data, error, isLoading } = useSWR<{ unread_count: number }>(
        token
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/unread_count`
            : null,
        fetcher,
        {
            refreshInterval: 30_000,
        },
    );

    return {
        count: data?.unread_count ?? 0,
        isLoading: !!token && isLoading,
        isError: !!error,
        isLoggedIn: !!token,
    };
}