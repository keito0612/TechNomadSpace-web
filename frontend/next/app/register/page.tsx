'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SocialLoginButtons } from '@/components/SocialLoginButtons';
import { AuthService } from '@/services/AuthService';
import AuthBodyConteiner from '@/components/AuthBodyConteiner';
import Layout from '@/components/Layout/Layout';
import NavBar from '@/components/Navbar';
import TextField from '@/components/Text/TextField';
import { useForm } from 'react-hook-form';
import { AuthForm, ResultType } from '@/types/types';
import Modal from '@/components/Modal';


interface RegisterForm extends AuthForm {
    name: string;
}

const SinUpLink = () => {
    return (
        <p className="mt-8 text-center text-sm text-gray-400">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-blue-400 hover:underline font-medium">
                ログイン
            </Link>
        </p>
    );
}

function RegisterPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSocialSuccess = searchParams.get('social_success') === 'true';
    const [isModal, setIsModal] = useState(isSocialSuccess);
    const [modalType, setModalType] = useState<ResultType>(isSocialSuccess ? 'Success' : 'Normal');
    const [titleModal, setTitleModal] = useState(isSocialSuccess ? '新規登録が完了しました。' : '');
    const [messageModal, setMessageModal] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterForm>();

    const onClose = () => {
        setIsModal(false);
        if (modalType === 'Success') {
            router.push('/');
        }
    }

    const onSubmit = async (dataSet: RegisterForm) => {
        setIsLoading(true);
        await AuthService.register({
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
            param: dataSet,
            success: (token) => {
                AuthService.setSesstion(token);
                setModalType('Success');
                setTitleModal('新規登録が完了しました。');
                setIsModal(true);
            },
            validetionError: (error: { key: string, value: string } | null) => {
                if (error !== null) {
                    setError(error.key as "email" | "password" | "name", {
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
                    新規登録
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <TextField id='name' type='text' className='space-y-1' title='名前' placeholder='名前は２０文字以内で入力してください。' errorMessage={errors.name?.message} register={register("name", {
                        required: "名前は必須です",
                        maxLength: {
                            value: 20,
                            message: '名前は20文字以内で入力してください。'
                        }
                    })} />
                    <TextField id='email' type='text' className='space-y-1' title='メールアドレス' placeholder='' errorMessage={errors.email?.message} register={register("email", {
                        required: "メールアドレスは必須です",
                        pattern: {
                            value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                            message: "このメールアドレスは無効です。",
                        },
                    })} />

                    <TextField id='password' type='password' className='space-y-1' placeholder='８文字以上１２文字以内で入力してください。' title='パスワード' register={
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

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading ? '新規登録中...' : '新規登録'}
                    </Button>
                </form>

                <SocialLoginButtons
                    from="register"
                    onError={(message: string) => {
                        setIsLoading(false);
                        setModalType('Error');
                        setTitleModal('エラーが発生しました。');
                        setMessageModal(message);
                        setIsModal(true);
                    }}
                    disabled={isLoading}
                />
                <SinUpLink />
            </AuthBodyConteiner>
            <Modal isOpen={isModal} onClose={onClose} title={titleModal} message={messageModal} type={modalType} />
        </Layout >
    );
}

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <Layout className="relative">
                    <NavBar />
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                </Layout>
            }
        >
            <RegisterPageContent />
        </Suspense>
    );
}
