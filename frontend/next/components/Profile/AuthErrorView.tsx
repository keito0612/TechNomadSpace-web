'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { AuthService } from '@/services/AuthService';

const AuthErrorView = () => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(true);

    useEffect(() => {
        AuthService.deleteSesstion();
    }, []);

    const handleClose = () => {
        setIsModalOpen(false);
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center pt-20 px-4">
            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                type="Warning"
                title="ログインが必要です"
                message="セッションの有効期限が切れました。再度ログインしてください。"
            />
        </div>
    );
};

export default AuthErrorView;
