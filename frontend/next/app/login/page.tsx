'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { AuthService } from '@/services/AuthService';
import Layout from '@/components/Layout/Layout';
import NavBar from '@/components/Navbar';
import AuthBodyConteiner from '@/components/AuthBodyConteiner';
import { useForm } from 'react-hook-form';
import { AuthForm, ResultType } from '@/types/types';
import TextField from '@/components/Text/TextField';
import Modal from '@/components/Modal';


const SinInLink = () => {
    return (
        <p className="mt-8 text-center text-sm text-gray-400">
            <span>アカウントをお持ちでない方は</span>
            <Link href="/register" className="text-blue-400 hover:underline font-medium">
                新規登録
            </Link>
        </p>
    );
}

const ForgotPasswordLink = () => {
    return (
        <div className="text-left">
            <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                パスワードをお忘れの方
            </Link>
        </div>
    );
}


export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSocialSuccess = searchParams.get('social_success') === 'true';
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, setError } = useForm<AuthForm>();
    const [isModal, setIsModal] = useState(isSocialSuccess);
    const [modalType, setModalType] = useState<ResultType>(isSocialSuccess ? 'Success' : 'Normal');
    const [titleModal, setTitleModal] = useState(isSocialSuccess ? 'ログインが完了しました。' : '');
    const [messageModal, setMessageModal] = useState("");

    const onClose = () => {
        setIsModal(false);
        if (modalType === 'Success') {
            router.push('/');
        }
    }

    const onSubmit = async (dataSet: AuthForm) => {
        setIsLoading(true);
        await AuthService.login({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
            param: dataSet,
            success: (token) => {
                setIsLoading(false);
                AuthService.setSesstion(token);
                setModalType('Success');
                setTitleModal('ログインが完了しました。');
                setIsModal(true);
            },
            validetionError: (error: { key: string, value: string } | null) => {
                if (error !== null) {
                    setError(error.key as "email" | "password", {
                        type: 'server',
                        message: error.value,
                    });
                }
                setIsLoading(false);
            },
            failure: (errorMessage) => {
                setModalType('Error');
                setTitleModal('エラーが発生しました。');
                setMessageModal(errorMessage);
                setIsModal(true);
                setIsLoading(false);
            },
        });
    };

    return (
        <Layout className="relative" >
            <NavBar />
            <AuthBodyConteiner>
                <h1 className="text-2xl font-bold text-center text-white mb-8">
                    ログイン
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <TextField id='email' type='text' className='space-y-2' title='メールアドレス' placeholder='' errorMessage={errors.email?.message} register={register("email", {
                        required: "メールアドレスは必須です",
                        pattern: {
                            value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                            message: "このメールアドレスは無効です。",
                        },
                    })} />

                    <TextField id='password' type='password' className='space-y-2' placeholder='８文字以上１２文字以内' title='パスワード' register={
                        register("password", {
                            required: "パスワードは必須です",
                            minLength: {
                                value: 8,
                                message: "パスワードは8文字以上入力してください。",
                            },
                            maxLength: {
                                value: 12,
                                message: "パスワードは12文字以内で入力してください。"
                            }
                        })
                    } errorMessage={errors.password?.message} />
                    <ForgotPasswordLink />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading ? 'ログイン中...' : 'ログイン'}
                    </Button>
                </form>

                <SocialLoginButtons
                    from="login"
                    onError={(message: string) => {
                        setModalType('Error');
                        setTitleModal('エラー');
                        setMessageModal(message);
                        setIsModal(true);
                    }}
                    disabled={isLoading}
                />
                <SinInLink />
            </AuthBodyConteiner>
            <Modal isOpen={isModal} onClose={onClose} title={titleModal} message={messageModal} type={modalType} />
        </Layout >
    );
}
