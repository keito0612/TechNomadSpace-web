"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ResultType, User } from "@/types";

import Modal from "./Modal";
import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import ProfileImage from "./Profile/ProfileImage";
import { AuthService } from "@/services/AuthService";
import { UtilApi } from "@/lib/utilApi";
import NotificationBell from "./NotificationBell";

interface NavBarProps {
    rightButton?: React.ReactNode;
    onBackClick?: () => void;
    onBack?: boolean;
}

const navigation = [
    { name: "検索", href: "/" },
    { name: "お気に入り", href: "/favorite" },
    { name: '設定', href: "/setting" }
];

const navigationBarTitles = [
    { name: "検索", href: "/" },
    { name: "お気に入り", href: "/favorite" },
    { name: '設定', href: "/setting" }
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

function NavBar({ rightButton, onBackClick = () => { }, onBack = false }: NavBarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [modalType, setModalType] = useState<ResultType>('Success');
    const [modalTitle, setModalTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isConfirmModal, setIsConfirmModalOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);


    const getUser = async () => {
        const url = `${UtilApi.API_URL}/api/user`;
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AuthService.getSesstion()}`,
                },
            });
            const data = await res.json();
            const user: User = data["user"] as User;
            setUser(user);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    const getTitle = () => {
        const title = navigationBarTitles.find((title) => title.href === pathname)?.name;
        return title ?? "";
    }

    const logoutClick = async () => {
        setModalType('Normal');
        setModalTitle('ログアウト');
        setModalMessage('ログアウトしますか？');
        setIsModalOpen(true);
    }

    const onConfirm = async () => {
        setIsModalOpen(false);
        await logout();
    }
    const onClone = () => {
        router.refresh();
        window.location.reload();
    }

    const backClick = () => {
        onBackClick();
        router.back();
    }

    const logout = async () => {
        const url = `${UtilApi.API_URL}/api/logout`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AuthService.getSesstion()}`,
                },
            });
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Request failed: ${res.status} - ${errorText}`);
            }

            setModalType('Success');
            setModalTitle('ログアウトが完了しました');
            setModalMessage('');
            setIsConfirmModalOpen(true);
            AuthService.deleteSesstion();
        } catch (error) {
            setModalType('Success');
            setModalTitle('ログアウトに失敗しました。');
            setModalMessage('もう一度お試しください。問題が続く場合は、ページを再読み込みしてください。');
            setIsConfirmModalOpen(true);
            console.error("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        setMounted(true);
        const session = AuthService.getSesstion();
        if (session) {
            setToken(session);
            getUser();
        }
    }, []);

    const filteredNavigation = navigation.filter((item) => {
        if (mounted && token) {
            return item.name !== "ログイン" && item.name !== "新規登録";
        }
        return true;
    });

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50">
                <div className="mx-auto">
                    {/* モバイル・タブレット：全幅の緑色ネイティブ風 / PC：フローティング白背景 */}
                    <div className="bg-black">
                        <div className="relative flex h-14 lg:h-16 items-center justify-center lg:justify-between px-5">

                            {/* 左側のロゴ・タイトル */}
                            <div className="flex items-center justify-between w-full relative">
                                {/* 左側：ロゴまたは戻るボタン */}
                                <div className="flex items-center min-w-[40px]">

                                    {/* PCのみロゴ表示 */}
                                    <div className="hidden lg:block">
                                        <span className="text-white font-bold text-lg">TechNomadSpace</span>
                                    </div>

                                    {/* モバイル・タブレットのみ戻るボタン表示 */}
                                    {onBack && (
                                        <button
                                            className="lg:hidden p-2 rounded-xl hover:bg-green-600 transition-all duration-200 active:scale-95"
                                            onClick={backClick}
                                            aria-label="戻る"
                                        >
                                            <ArrowLeft className="text-xl text-white" />
                                        </button>
                                    )}
                                </div>

                                {/* 中央：タイトル（モバイル・タブレット） */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 lg:hidden">
                                    <span className="text-white text-lg font-bold whitespace-nowrap">
                                        {getTitle()}
                                    </span>
                                </div>

                                {/* 右側：ボタン（ない場合は空のスペース） */}
                                <div className="flex items-center min-w-[40px]">
                                    <div className="lg:hidden flex items-center">
                                        <NotificationBell />
                                    </div>
                                    {rightButton}
                                </div>

                                {/* PC用ナビゲーション */}
                                <div className="hidden lg:ml-8 lg:block">
                                    <div className="flex space-x-2">
                                        {filteredNavigation.map((item) => {
                                            const isCurrent = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    aria-current={isCurrent ? "page" : undefined}
                                                    className={classNames(
                                                        isCurrent
                                                            ? "bg-green-500 text-white shadow-md"
                                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                                        "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* 右側のユーザー情報（PCのみ） */}
                            <div className="hidden lg:flex absolute inset-y-0 right-0 items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <NotificationBell />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="relative flex rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 overflow-hidden transition-transform hover:scale-105">
                                            <ProfileImage
                                                imageUrl={user?.image_path ?? null}
                                                sizes={40}
                                            />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-52 rounded-2xl bg-white/95 backdrop-blur-xl py-2 shadow-xl"
                                        >
                                            <DropdownMenuItem
                                                render={<Link href="/profile" />}
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-xl mx-2 transition-colors cursor-pointer"
                                            >
                                                プロフィール
                                            </DropdownMenuItem>
                                            {token && (
                                                <DropdownMenuItem
                                                    onClick={logoutClick}
                                                    className="block w-[calc(100%-16px)] text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-xl mx-2 transition-colors cursor-pointer"
                                                >
                                                    ログアウト
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    {user?.name && (
                                        <p className="font-semibold text-gray-700 ml-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                            {user.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* モバイル・タブレット用メニュー（Sheet） */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger className="lg:hidden fixed top-4 right-4 p-2 rounded-xl bg-green-600 hover:bg-green-700 transition-all duration-200 hidden">
                        <Menu className="text-white w-6 h-6" />
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-green-600 border-green-700">
                        <SheetHeader>
                            <SheetTitle className="text-white text-lg font-bold">メニュー</SheetTitle>
                        </SheetHeader>
                        <div className="px-3 py-2 space-y-1">
                            {filteredNavigation.map((item) => {
                                const isCurrent = pathname === item.href;
                                return (
                                    <SheetClose key={item.name}>
                                        <Link
                                            href={item.href}
                                            aria-current={isCurrent ? "page" : undefined}
                                            className={classNames(
                                                isCurrent
                                                    ? "bg-green-700 text-white"
                                                    : "text-green-100 hover:bg-green-700 hover:text-white",
                                                "block rounded-xl px-4 py-3 text-base font-medium transition-all duration-200"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    </SheetClose>
                                );
                            })}
                        </div>
                    </SheetContent>
                </Sheet>
            </nav>
            {/* ログアウト確認用モーダル */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
                message={modalMessage}
                title={modalTitle}
                onConfirm={onConfirm}
            />
            {/* ログアウトの処理が終わった後のモーダル */}
            <Modal
                isOpen={isConfirmModal}
                onClose={onClone}
                type={modalType}
                message={modalMessage}
                title={modalTitle}
                onConfirm={onConfirm}
            />
        </>
    );
}

export default NavBar;
