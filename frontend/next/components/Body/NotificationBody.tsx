'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bell, User, Trash2 } from 'lucide-react';
import { Notification, ModalState } from '@/types/types';
import { UtilDate } from '@/lib/utilDate';
import { NotificationService } from '@/services/NotificationService';
import Modal from '@/components/Modal';

interface NotificationBodyProps {
    notification: Notification;
}

const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'like':
            return <Heart className="h-6 w-6 text-blue-700 fill-blue-700" />;
        case 'post':
            return <Bell className="h-6 w-6 text-blue-500" />;
        default:
            return <Bell className="h-6 w-6 text-gray-500" />;
    }
};

const NotificationBody = ({ notification }: NotificationBodyProps) => {
    const router = useRouter();
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        type: 'Warning',
        title: '',
        message: '',
    });
    const [isSuccessModal, setIsSuccessModal] = useState(false);

    const handleDelete = () => {
        setModalState({
            isOpen: true,
            type: 'Warning',
            title: 'この通知を削除',
            message: 'この通知を削除しますか？',
        });
    };

    const confirmDelete = () => {
        NotificationService.delete({
            notificationId: notification.id,
            success: () => {
                setModalState({ ...modalState, isOpen: false });
                setIsSuccessModal(true);
            },
            failure: () => {
                setModalState({
                    isOpen: true,
                    type: 'Error',
                    title: 'エラーが発生しました',
                    message: '削除に失敗しました。もう一度お試しください。',
                });
            },
        });
    };

    const handleSuccessClose = () => {
        setIsSuccessModal(false);
        router.push('/notifications');
    };
    return (
        <div className="max-w-3xl mx-auto bg-gray-900 rounded-xl p-6 mt-20">
            {/* 通知タイプアイコン */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gray-800 rounded-full">
                    <NotificationIcon type={notification.type} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white">{notification.title}</h1>
                    <p className="text-sm text-gray-500" suppressHydrationWarning>
                        {UtilDate.formatDateTime(notification.created_at)}
                    </p>
                </div>
            </div>

            {/* いいねの場合、ユーザー情報を表示 */}
            {notification.type === 'like' && notification.from_user && (
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-3">いいねしたユーザー</p>
                    <Link
                        href={`/profile/${notification.from_user.id}`}
                        className="flex items-center gap-4 hover:bg-gray-700 rounded-lg p-3 transition -m-3"
                    >
                        {notification.from_user.image_path ? (
                            <Image
                                src={notification.from_user.image_path}
                                alt={notification.from_user.name || ''}
                                unoptimized
                                width={56}
                                height={56}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center">
                                <User className="h-7 w-7 text-gray-400" />
                            </div>
                        )}
                        <div>
                            <p className="text-lg font-semibold text-white">
                                {notification.from_user.name}
                            </p>
                            <p className="text-sm text-blue-400">プロフィールを見る</p>
                        </div>
                    </Link>
                </div>
            )}

            {/* 通知内容 */}
            <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">内容</p>
                <p className="text-white leading-relaxed">{notification.content}</p>
            </div>

            {/* ボタンエリア */}
            <div className="mt-6 flex items-center gap-4">
                {/* レビューへのリンク（いいねの場合） */}
                {notification.type === 'like' && notification.review?.location_id && (
                    <Link
                        href={`/locations/${notification.review.location_id}`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition font-medium"
                    >
                        レビューを見る
                    </Link>
                )}
                {/* 削除ボタン */}
                <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition font-medium"
                >
                    <Trash2 className="h-5 w-5" />
                    削除
                </button>
            </div>

            {/* 確認モーダル */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                onConfirm={modalState.type === 'Warning' ? confirmDelete : undefined}
                confirmLabel="削除する"
                cancelLabel="キャンセル"
            />

            {/* 成功モーダル */}
            <Modal
                isOpen={isSuccessModal}
                onClose={handleSuccessClose}
                title="削除しました"
                message="通知を削除しました。"
                type="Success"
            />
        </div>
    );
};

export default NotificationBody;