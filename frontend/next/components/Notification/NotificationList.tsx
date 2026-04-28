'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ModalState, Notification, PaginationMeta } from '@/types/types';
import { NotificationService } from '@/services/NotificationService';
import { Heart, Bell, CheckCheck, Trash2 } from 'lucide-react';
import PageNation from '../PageNation';
import { UtilDate } from '@/lib/utilDate';
import Modal from '../Modal';

interface NotificationListProps {
    initialNotifications: Notification[];
    pagination: PaginationMeta;
    currentPage: number;
}

const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'like':
            return <Heart className="h-4 w-4 text-red-500 fill-red-500" />;
        case 'post':
            return <Bell className="h-4 w-4 text-blue-500" />;
        default:
            return <Bell className="h-4 w-4 text-gray-500" />;
    }
};

interface NotificationHeaderProps {
    hasUnread: boolean;
    hasNotifications: boolean;
    handleMarkAllAsRead: () => void;
    handleDeleteAll: () => void;
}

const NotificationHeader = ({ hasUnread, hasNotifications, handleMarkAllAsRead, handleDeleteAll }: NotificationHeaderProps) => {
    return (
        <div className="flex items-center justify-between mb-6 mt-4">
            <h1 className="hidden lg:block text-2xl font-bold text-white">お知らせ</h1>
            <div className="flex items-center gap-4">
                {hasUnread && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition"
                    >
                        <CheckCheck className="h-4 w-4" />
                        すべて既読
                    </button>
                )}
                {hasNotifications && (
                    <button
                        onClick={handleDeleteAll}
                        className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
                    >
                        <Trash2 className="h-4 w-4" />
                        すべて削除
                    </button>
                )}
            </div>
        </div>
    );
}

const NoNotification = () => {
    return (
        <div className="text-center py-16">
            <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">お知らせはありません</p>
        </div>
    );
}

const NotificationItemContent = ({ notification }: { notification: Notification }) => {
    return (
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">
                {notification.title}
            </p>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {notification.content}
            </p>
            <p className="text-xs text-gray-500 mt-2">
                {UtilDate.formatTimeAgo(notification.created_at)}
            </p>
        </div>
    );
}


const NotificationItemImage = ({ notification }: { notification: Notification }) => {
    return (
        <div className="relative flex-shrink-0">
            {notification.from_user?.image_path ? (
                <Image
                    src={notification.from_user.image_path}
                    alt={notification.from_user.name || ''}
                    unoptimized
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                />
            ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <Bell className="h-5 w-5 text-gray-400" />
                </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-0.5">
                <NotificationIcon type={notification.type} />
            </div>
        </div>
    );
}

const NotificationItemRead = ({ isRead }: { isRead: boolean }) => {
    return (
        <>
            {!isRead && (
                <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
            )}
        </>
    );
}



const NotificationItem = ({ notification, handleNotificationClick }: { notification: Notification, handleNotificationClick: (notification: Notification) => void }) => {
    return (
        <div
            onClick={() => handleNotificationClick(notification)}
            className={`
                    rounded-lg p-4 cursor-pointer transition
                                    ${notification.is_read
                    ? 'bg-gray-800 hover:bg-gray-750'
                    : 'bg-gray-700 hover:bg-gray-650 border-l-4 border-blue-500'
                }
                                `}
        >
            <div className="flex items-start gap-3">
                <NotificationItemImage notification={notification} />
                <NotificationItemContent notification={notification} />
                <NotificationItemRead isRead={notification.is_read} />
            </div>
        </div>
    );
}


const Notifications = ({ notifications, handleNotificationClick }: { notifications: Notification[], handleNotificationClick: (notification: Notification) => void }) => {
    return (
        <div className="space-y-2">
            {notifications.map((notification, index) => (
                <NotificationItem key={index} notification={notification} handleNotificationClick={handleNotificationClick} />
            ))}
        </div>
    );
}

export default function NotificationList({
    initialNotifications,
    pagination,
    currentPage,
}: NotificationListProps) {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [modalState, setIsModalState] = useState<ModalState>({
        isOpen: false,
        type: 'Warning',
        title: '',
        message: '',
    });

    const handleMarkAsRead = (notification: Notification) => {
        if (notification.is_read) return;

        NotificationService.markAsRead({
            notificationId: notification.id,
            success: () => {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notification.id ? { ...n, is_read: true } : n
                    )
                );
            },
            failure: () => {

            },
        });
    };

    const handleMarkAllAsRead = () => {
        NotificationService.markAllAsRead({
            success: () => {
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, is_read: true }))
                );
            },
            failure: () => {
            },
        });
    };

    const handleDeleteAll = () => {
        setIsModalState({
            isOpen: true,
            type: 'Warning',
            title: '通知をすべて削除',
            message: 'すべての通知を削除しますか？一度削除した通知は復元できません。',
        });
    };

    const confirmDeleteAll = () => {
        NotificationService.deleteAll({
            success: () => {
                setNotifications([]);
                setIsModalState({
                    isOpen: true,
                    type: 'Success',
                    title: '削除しました',
                    message: 'すべての通知を削除しました。',
                });
            },
            failure: (error) => {
                if (!error.isAuthError) {
                    setIsModalState({
                        isOpen: true,
                        type: 'Error',
                        title: 'エラーが発生しました',
                        message: 'サーバー側で問題が発生しました。\nお手数ですが、もう一度お試しください。',
                    });
                }
            }
        });
    };

    const handleNotificationClick = (notification: Notification) => {
        handleMarkAsRead(notification);
        router.push(`/notifications/${notification.id}`);
    };

    const onClose = () => {
        setIsModalState((value) => ({ ...value, isOpen: false }));
    }

    const hasUnread = notifications.some((n) => !n.is_read);
    const hasNotifications = notifications.length > 0;

    return (
        <>
            <div key={currentPage}>
                <NotificationHeader
                    hasUnread={hasUnread}
                    hasNotifications={hasNotifications}
                    handleMarkAllAsRead={handleMarkAllAsRead}
                    handleDeleteAll={handleDeleteAll}
                />
                {notifications.length === 0 ? (
                    <NoNotification />
                ) : (
                    <>
                        <Notifications notifications={notifications} handleNotificationClick={handleNotificationClick} />
                        <PageNation currentPage={currentPage} lastPage={pagination.last_page} total={pagination.total} perPage={pagination.per_page} />
                    </>
                )}
            </div>
            <Modal
                isOpen={modalState.isOpen}
                onClose={onClose}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                onConfirm={modalState.type === 'Warning' ? confirmDeleteAll : undefined}
                confirmLabel="削除する"
                cancelLabel="キャンセル"
            />
        </>
    );
}
