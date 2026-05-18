'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout/Layout';
import NavBar from '@/components/Navbar';
import AuthBodyConteiner from '@/components/AuthBodyConteiner';
import { useForm } from 'react-hook-form';
import { ResultType } from '@/types/types';
import TextField from '@/components/Text/TextField';
import Modal from '@/components/Modal';

interface ForgotPasswordForm {
    email: string;
}

const BackToLoginLink = () => {
    return (
        <p className="mt-8 text-center text-sm text-gray-400">
            <Link href="/login" className="text-blue-400 hover:underline font-medium">
                ログイン画面に戻る
            </Link>
        </p>
    );
}

const ConteinerHeader = () => {
    return (
        <>
            <h1 className="text-2xl font-bold text-center text-white mb-4">
                パスワード再設定メール送信
            </h1>
            <p className="text-center text-gray-400 text-sm mb-8">
                ご登録のメールアドレスを入力してください。<br />
                パスワード再設定用のリンクをお送りします。
            </p>
        </>
    );
}

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, setError } = useForm<ForgotPasswordForm>();
    const [isModal, setIsModal] = useState(false);
    const [modalType, setModalType] = useState<ResultType>('Normal');
    const [titleModal, setTitleModal] = useState('');
    const [messageModal, setMessageModal] = useState('');

    const onClose = () => {
        setIsModal(false);
    }

    const onSubmit = async (dataSet: ForgotPasswordForm) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email: dataSet.email }),
            });

            const data = await res.json();

            if (res.ok) {
                setModalType('Success');
                setTitleModal('メールを送信しました');
                setMessageModal('パスワード再設定用のリンクをメールで送信しました。メールをご確認ください。');
                setIsModal(true);
            } else {
                if (data.errors?.email) {
                    setError('email', {
                        type: 'server',
                        message: data.errors.email[0],
                    });
                } else if (data.message) {
                    setModalType('Error');
                    setTitleModal('エラーが発生しました');
                    setMessageModal(data.message);
                    setIsModal(true);
                }
            }
        } catch (error) {
            setModalType('Error');
            setTitleModal('エラーが発生しました');
            setMessageModal('予期しないエラーが発生しました。');
            setIsModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout className="relative">
            <NavBar title={"パスワード再設定メール送信"} onBack />
            <AuthBodyConteiner>
                <ConteinerHeader />
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <TextField
                        id='email'
                        type='text'
                        className='space-y-2'
                        title='メールアドレス'
                        placeholder='example@email.com'
                        errorMessage={errors.email?.message}
                        register={register("email", {
                            required: "メールアドレスは必須です",
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                                message: "このメールアドレスは無効です。",
                            },
                        })}
                    />

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading ? '送信中...' : 'パスワード再設定メール'}
                    </Button>
                </form>

                <BackToLoginLink />
            </AuthBodyConteiner>
            <Modal
                isOpen={isModal}
                onClose={onClose}
                title={titleModal}
                message={messageModal}
                type={modalType}
            />
        </Layout>
    );
}
