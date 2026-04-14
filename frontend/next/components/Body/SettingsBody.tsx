'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Mail, LogOut, Trash2, ChevronRight, Loader2, FileText, Shield, MessageCircle, LogIn } from 'lucide-react';
import { SettingService, UserSetting } from '@/services/SettingService';
import { AuthService } from '@/services/AuthService';
import Modal from '../Modal';

interface SettingsBodyProps {
    initialSetting: UserSetting | null;
    isLoggedIn: boolean;
}

interface ToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
}

const Toggle = ({ enabled, onChange, disabled }: ToggleProps) => {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!enabled)}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-blue-600' : 'bg-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    action: React.ReactNode;
}

const SettingItem = ({ icon, title, description, action }: SettingItemProps) => {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                    {icon}
                </div>
                <div>
                    <p className="text-white font-medium">{title}</p>
                    {description && (
                        <p className="text-gray-400 text-sm">{description}</p>
                    )}
                </div>
            </div>
            {action}
        </div>
    );
};

interface DangerButtonProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    onClick: () => void;
    isLoading?: boolean;
}

const DangerButton = ({ icon, title, description, onClick, isLoading }: DangerButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-900/30 rounded-lg">
                    {icon}
                </div>
                <div className="text-left">
                    <p className="text-red-400 font-medium">{title}</p>
                    {description && (
                        <p className="text-gray-400 text-sm">{description}</p>
                    )}
                </div>
            </div>
            {isLoading ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
        </button>
    );
};

interface LinkItemProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    href: string;
}

const LinkItem = ({ icon, title, description, href }: LinkItemProps) => {
    return (
        <Link
            href={href}
            className="w-full flex items-center justify-between p-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                    {icon}
                </div>
                <div className="text-left">
                    <p className="text-white font-medium">{title}</p>
                    {description && (
                        <p className="text-gray-400 text-sm">{description}</p>
                    )}
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
    );
};

const SettingsBody = ({ initialSetting, isLoggedIn }: SettingsBodyProps) => {
    const router = useRouter();
    const [setting, setSetting] = useState<UserSetting>(initialSetting ?? { isEmail: false, isNotification: false });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleToggle = async (key: keyof UserSetting, value: boolean) => {
        setIsUpdating(true);
        const newSetting = { ...setting, [key]: value };
        setSetting(newSetting);

        const result = await SettingService.updateSetting({ [key]: value });
        if (!result.success) {
            setSetting(setting);
            setErrorMessage(result.message || '設定の更新に失敗しました');
            setShowErrorModal(true);
        }
        setIsUpdating(false);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        AuthService.deleteSesstion();
        router.push('/');
    };

    const handleDeleteAccount = async () => {
        setIsDeletingAccount(true);
        const result = await SettingService.deleteAccount();
        if (result.success) {
            AuthService.deleteSesstion();
            router.push('/');
        } else {
            setErrorMessage(result.message || 'アカウントの削除に失敗しました');
            setShowErrorModal(true);
            setIsDeletingAccount(false);
        }
        setShowDeleteModal(false);
    };

    return (
        <div className="max-w-5xl mx-auto w-full min-h-screen bg-black pt-16">
            <div className="px-4 py-4">
                <h1 className="text-2xl font-bold text-white mb-6">設定</h1>

                {/* 通知設定セクション - ログイン時のみ有効 */}
                <div className="mb-6">
                    <h2 className="text-gray-400 text-sm font-medium mb-3 px-1">通知設定</h2>
                    {!isLoggedIn && (
                        <p className="text-gray-500 text-sm mb-3 px-1">ログインすると通知設定を変更できます</p>
                    )}
                    <div className="flex flex-col gap-3">
                        <SettingItem
                            icon={<Bell className={`w-5 h-5 ${isLoggedIn ? 'text-blue-400' : 'text-gray-500'}`} />}
                            title="プッシュ通知"
                            description="新しいお知らせをプッシュ通知で受け取る"
                            action={
                                <Toggle
                                    enabled={setting.isNotification}
                                    onChange={(value) => handleToggle('isNotification', value)}
                                    disabled={!isLoggedIn || isUpdating}
                                />
                            }
                        />
                        <SettingItem
                            icon={<Mail className={`w-5 h-5 ${isLoggedIn ? 'text-blue-400' : 'text-gray-500'}`} />}
                            title="メール通知"
                            description="新しいお知らせをメールで受け取る"
                            action={
                                <Toggle
                                    enabled={setting.isEmail}
                                    onChange={(value) => handleToggle('isEmail', value)}
                                    disabled={!isLoggedIn || isUpdating}
                                />
                            }
                        />
                    </div>
                </div>

                {/* サポートセクション */}
                <div className="mb-6">
                    <h2 className="text-gray-400 text-sm font-medium mb-3 px-1">サポート</h2>
                    <div className="flex flex-col gap-3">
                        <LinkItem
                            icon={<MessageCircle className="w-5 h-5 text-blue-400" />}
                            title="お問い合わせ"
                            description="ご質問・ご要望はこちら"
                            href="/contact"
                        />
                    </div>
                </div>

                {/* 規約セクション */}
                <div className="mb-6">
                    <h2 className="text-gray-400 text-sm font-medium mb-3 px-1">規約・ポリシー</h2>
                    <div className="flex flex-col gap-3">
                        <LinkItem
                            icon={<FileText className="w-5 h-5 text-blue-400" />}
                            title="利用規約"
                            href="/terms"
                        />
                        <LinkItem
                            icon={<Shield className="w-5 h-5 text-blue-400" />}
                            title="プライバシーポリシー"
                            href="/privacy"
                        />
                    </div>
                </div>

                {/* アカウントセクション */}
                <div className="mb-6">
                    <h2 className="text-gray-400 text-sm font-medium mb-3 px-1">アカウント</h2>
                    <div className="flex flex-col gap-3">
                        {isLoggedIn ? (
                            <>
                                <DangerButton
                                    icon={<LogOut className="w-5 h-5 text-red-400" />}
                                    title="ログアウト"
                                    description="アカウントからログアウトします"
                                    onClick={handleLogout}
                                    isLoading={isLoggingOut}
                                />
                                <DangerButton
                                    icon={<Trash2 className="w-5 h-5 text-red-400" />}
                                    title="アカウントを削除"
                                    description="アカウントと全てのデータを削除します"
                                    onClick={() => setShowDeleteModal(true)}
                                    isLoading={isDeletingAccount}
                                />
                            </>
                        ) : (
                            <LinkItem
                                icon={<LogIn className="w-5 h-5 text-blue-400" />}
                                title="ログイン"
                                description="アカウントにログインします"
                                href="/login"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* 削除確認モーダル */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                type="Warning"
                title="アカウントを削除しますか？"
                message="この操作は取り消せません。全てのデータが削除されます。"
                onConfirm={handleDeleteAccount}
                confirmLabel="削除する"
                cancelLabel="キャンセル"
            />

            {/* エラーモーダル */}
            <Modal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                type="Error"
                title="エラー"
                message={errorMessage}
            />
        </div>
    );
};

export default SettingsBody;
