'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout/Layout';
import NavBar from '@/components/Navbar';
import AuthBodyConteiner from '@/components/AuthBodyConteiner';
import { useForm } from 'react-hook-form';
import { ResultType } from '@/types/types';
import TextField from '@/components/Text/TextField';
import Modal from '@/components/Modal';

interface ResetPasswordForm {
    password: string;
    password_confirmation: string;
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

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<ResetPasswordForm>();
    const [isModal, setIsModal] = useState(false);
    const [modalType, setModalType] = useState<ResultType>('Normal');
    const [titleModal, setTitleModal] = useState('');
    const [messageModal, setMessageModal] = useState('');

    useEffect(() => {
        if (!token || !email) {
            setModalType('Error');
            setTitleModal('無効なリンク');
            setMessageModal('パスワードリセットリンクが無効です。もう一度お試しください。');
            setIsModal(true);
        }
    }, [token, email]);

    const onClose = () => {
        setIsModal(false);
        if (modalType === 'Success') {
            router.push('/login');
        } else if (!token || !email) {
            router.push('/forgot-password');
        }
    }

    const onSubmit = async (dataSet: ResetPasswordForm) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    email: email,
                    password: dataSet.password,
                    password_confirmation: dataSet.password_confirmation,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setModalType('Success');
                setTitleModal('パスワードを変更しました');
                setMessageModal('パスワードが正常に変更されました。新しいパスワードでログインしてください。');
                setIsModal(true);
            } else {
                if (data.errors) {
                    if (data.errors.password) {
                        setError('password', {
                            type: 'server',
                            message: data.errors.password[0],
                        });
                    }
                    if (data.errors.email) {
                        setModalType('Error');
                        setTitleModal('エラーが発生しました');
                        setMessageModal(data.errors.email[0]);
                        setIsModal(true);
                    }
                    if (data.errors.token) {
                        setModalType('Error');
                        setTitleModal('リンクが無効です');
                        setMessageModal('パスワードリセットリンクの有効期限が切れています。もう一度お試しください。');
                        setIsModal(true);
                    }
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

    const password = watch('password');

    return (
        <Layout className="relative">
            <NavBar title={"新しいパスワード設定"} />
            <AuthBodyConteiner>
                <h1 className="text-2xl font-bold text-center text-white mb-4">
                    新しいパスワードを設定
                </h1>
                <p className="text-center text-gray-400 text-sm mb-8">
                    新しいパスワードを入力してください。
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <TextField
                        id='password'
                        type='password'
                        className='space-y-2'
                        title='新しいパスワード'
                        placeholder='8文字以上12文字以内'
                        errorMessage={errors.password?.message}
                        register={register("password", {
                            required: "パスワードは必須です",
                            minLength: {
                                value: 8,
                                message: "パスワードは8文字以上入力してください。",
                            },
                            maxLength: {
                                value: 12,
                                message: "パスワードは12文字以内で入力してください。"
                            }
                        })}
                    />

                    <TextField
                        id='password_confirmation'
                        type='password'
                        className='space-y-2'
                        title='新しいパスワード（確認）'
                        placeholder='パスワードを再入力'
                        errorMessage={errors.password_confirmation?.message}
                        register={register("password_confirmation", {
                            required: "パスワード確認は必須です",
                            validate: (value) =>
                                value === password || "パスワードが一致しません。"
                        })}
                    />

                    <Button
                        type="submit"
                        disabled={isLoading || !token || !email}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading ? '変更中...' : 'パスワードを変更'}
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
