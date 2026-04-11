'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Profile } from '@/types/types';
import TextArea from '../Text/TextArea';
import TextField from '../Text/TextField';
import { AuthService } from '@/services/AuthService';
import Modal from '../Modal';
import Loading from '../Loading';
import ProfileImageSection from './ProfileImagePicker';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

interface ProfileEditForm {
    name: string;
    comment: string;
    profileImage: FileList | null;
    backgroundImage: FileList | null;
}

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile;
    onSuccess: () => void;
}

const validateImage = (files: FileList | null | undefined): string | true => {
    if (!files || files.length === 0) {
        return true;
    }
    const file = files[0];
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return '画像の形式はjpeg、png、jpgのいずれかにしてください';
    }
    if (file.size > MAX_FILE_SIZE) {
        return '画像のサイズは2MB以内にしてください';
    }
    return true;
};

export default function ProfileEditModal({
    isOpen,
    onClose,
    profile,
    onSuccess,
}: ProfileEditModalProps) {
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
        profile.image_path
    );
    const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(
        profile.background_image_path
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // モーダルが開かれたときに状態をリセット
    useEffect(() => {
        if (isOpen) {
            setProfileImagePreview(profile.image_path);
            setBackgroundImagePreview(profile.background_image_path);
            setSubmitError(null);
        }
    }, [isOpen, profile.image_path, profile.background_image_path]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        setError,
    } = useForm<ProfileEditForm>({
        defaultValues: {
            name: profile.name,
            comment: profile.comment || '',
            profileImage: null,
            backgroundImage: null,
        },
    });

    const { ref: profileImageRef, ...profileImageRegister } = register('profileImage', {
        validate: validateImage,
    });
    const { ref: backgroundImageRef, ...backgroundImageRegister } = register('backgroundImage', {
        validate: validateImage,
    });

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await profileImageRegister.onChange(e);
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const isValid = await trigger('profileImage');
            if (isValid) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProfileImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleBackgroundImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await backgroundImageRegister.onChange(e);

        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const isValid = await trigger('backgroundImage');
            if (isValid) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setBackgroundImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const onSubmit = async (data: ProfileEditForm) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('comment', data.comment || '');

            if (data.profileImage && data.profileImage.length > 0) {
                formData.append('profileImage', data.profileImage[0]);
            }
            if (data.backgroundImage && data.backgroundImage.length > 0) {
                formData.append('backgroundImage', data.backgroundImage[0]);
            }

            const token = AuthService.getSesstion();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/edit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'プロフィールの更新に失敗しました');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'エラーが発生しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                {isSubmitting && (
                    <Loading message={"保存中..."} />
                )}
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-white">
                        プロフィール編集
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <ProfileImageSection
                        backgroundImage={{
                            preview: backgroundImagePreview,
                            onImageChange: handleBackgroundImageChange,
                            register: backgroundImageRegister,
                            registerRef: backgroundImageRef,
                            error: errors.backgroundImage?.message,
                        }}
                        profileImage={{
                            preview: profileImagePreview,
                            onImageChange: handleProfileImageChange,
                            register: profileImageRegister,
                            registerRef: profileImageRef,
                            error: errors.profileImage?.message,
                        }}
                    />

                    <div className="pt-6 space-y-4">
                        <TextField id='name' title='名前' type='text' placeholder='名前' register={
                            register('name', {
                                required: '名前は必須です',
                                maxLength: {
                                    value: 100,
                                    message: '名前は100文字以内で入力してください',
                                },
                            })
                        } errorMessage={errors.name?.message} />
                        <TextArea id='comment' title='コメント' placeholder='コメント入力' register={register('comment', {
                            maxLength: {
                                value: 300,
                                message: 'コメントは300文字以内で入力してください',
                            },
                        })} errorMessage={errors.comment?.message} />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="border-gray-600 text-white hover:bg-gray-800"
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    保存中...
                                </>
                            ) : (
                                '保存'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>

            {/* エラーモーダル */}
            <Modal
                isOpen={!!submitError}
                onClose={() => setSubmitError(null)}
                title="エラー"
                message={submitError || ''}
                type="Error"
            />
        </Dialog>
    );
}
