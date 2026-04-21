'use client';
import Modal from "@/components/Modal";
import { useState } from "react";
import ProfileSkeleton from "./skeleton";
import { useRouter } from "next/navigation";

interface ErrorViewProps {
    isAuthError: boolean;
}

const ErrorView = ({ isAuthError }: ErrorViewProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();
    const onClose = () => {
        if (isAuthError) {
            router.push('/login');
        }
        setIsOpen(false);
    }
    return (
        <>
            <ProfileSkeleton />
            <Modal isOpen={isOpen} onClose={onClose} title={isAuthError === true ? "ログインが必要です。" : "プロフィール情報の取得に失敗しました。"} message={isAuthError === true ? "セッションの有効期限が切れました。再度ログインしてください。" : "もう一度、お試しください。"} type={isAuthError === true ? "Warning" : "Error"} onCloneLabel={isAuthError === true ? "ログイン" : "閉じる"} />
        </>
    );
}

export default ErrorView;