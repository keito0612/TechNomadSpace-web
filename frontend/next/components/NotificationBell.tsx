'use client';
import { useUnreadCount } from '@/app/hooks/useUnreadCount';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function NotificationBell() {
    const { count, isLoading, isError, isLoggedIn } = useUnreadCount();
    const router = useRouter();

    // ログインしていない場合は何も表示しない
    if (!isLoggedIn) {
        return null;
    }

    if (isError) return (
        <div className="rounded-full transition duration-200 ease-in-out hover:opacity-75">
            <Bell aria-hidden="true" className="h-6 w-6 text-white lg:text-blue-800" />
        </div>
    );

    const onClick = () => {
        router.push('/notifications');
    }
    // 読み込み中は数字なしで表示
    const showBadge = isLoading === false && count > 0;
    const badgeText = count > 99 ? '99+' : count >= 1 ? count : '';

    return (
        <div className="relative inline-block rounded-full ease-in-out hover:opacity-75" onClick={onClick} >
            <div className="group transition">
                <Bell
                    aria-hidden="true"
                    className="h-6 w-6 text-white lg:text-blue-800 transition"
                />
            </div>


            {showBadge && (
                <span
                    className="
        absolute -top-1 -right-1
        flex h-4 min-w-[1rem] items-center justify-center
        rounded-full bg-red-500 px-1
        text-[10px] font-bold leading-none text-white
      "
                >
                    {badgeText}
                </span>
            )}
        </div>

    )
}