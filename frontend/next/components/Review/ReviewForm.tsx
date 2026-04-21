"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewService } from "@/services/ReviewService";
import { useRouter } from "next/navigation";
import { ResultType, Review, Photo } from "@/types/types";
import { compressImages, CompressedImage } from "@/lib/compressImage";
import TextArea from "../Text/TextArea";
import Loading from "../Loading";
import Modal from "../Modal";
import LocationSection from "./LocationSection";
import RatingSection from "./RatingSection";
import ImageUploader, { MAX_IMAGE_COUNT } from "./ImageUploader";

// Constants
const MAX_RATING = 5;
const MIN_RATING = 0;

// Types
interface ReviewFormProps {
    locationId: number;
    review?: Review;
    locationName: string;
    locationImagePath?: string;
}

interface ExistingImage {
    id: number;
    url: string;
}

interface ReviewFormData {
    rating: number;
    comment: string;
    newImages: CompressedImage[];
    existingImages: ExistingImage[];
    deleteImageIds: number[];
}

interface ModalState {
    isOpen: boolean;
    type: ResultType;
    title: string;
    message: string;
}

// Sub-components
const SubmitButton = ({ isSubmitting, isEditMode }: { isSubmitting: boolean; isEditMode: boolean }) => (
    <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
            "w-full flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
            isSubmitting
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
        )}
    >
        {isSubmitting ? (
            <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditMode ? "更新中..." : "投稿中..."}
            </>
        ) : (
            isEditMode ? "更新する" : "投稿する"
        )}
    </button>
);

const convertPhotosToExistingImages = (photos: Photo[] | undefined): ExistingImage[] => {
    if (!photos) return [];
    return photos.map((photo) => ({
        id: photo.id,
        url: photo.photoUrl,
    }));
};

export default function ReviewForm({
    locationId,
    review,
    locationName,
    locationImagePath,
}: ReviewFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        type: "Normal",
        title: "",
        message: "",
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!review;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<ReviewFormData>({
        defaultValues: {
            rating: review?.rating || 0,
            comment: review?.comment || "",
            newImages: [],
            existingImages: convertPhotosToExistingImages(review?.photos),
            deleteImageIds: [],
        },
    });

    const rating = watch("rating");
    const newImages = watch("newImages");
    const existingImages = watch("existingImages");
    const deleteImageIds = watch("deleteImageIds");

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        clearErrors("newImages");
        const selectedFiles = Array.from(files);
        const compressedImages = await compressImages(selectedFiles);
        setValue("newImages", [...newImages, ...compressedImages]);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveExistingImage = (index: number) => {
        clearErrors("newImages");
        const imageToRemove = existingImages[index];
        setValue("deleteImageIds", [...deleteImageIds, imageToRemove.id]);
        setValue(
            "existingImages",
            existingImages.filter((_, i) => i !== index)
        );
    };

    const handleRemoveNewImage = (index: number) => {
        clearErrors("newImages");
        setValue(
            "newImages",
            newImages.filter((_, i) => i !== index)
        );
    };

    const handleRatingChange = (delta: number) => {
        const newRating = rating + delta;
        if (newRating >= MIN_RATING && newRating <= MAX_RATING) {
            setValue("rating", newRating);
        }
    };

    const showModal = (type: ResultType, title: string, message: string = "") => {
        setModalState({ isOpen: true, type, title, message });
    };

    const handleModalClose = () => {
        const shouldRedirect = modalState.type === "Success";
        setModalState((prev) => ({ ...prev, isOpen: false }));
        if (shouldRedirect) {
            router.back();
            router.refresh();
        }
    };

    const onSubmit = async (data: ReviewFormData) => {
        // 画像枚数のバリデーション
        const totalImageCount = data.existingImages.length + data.newImages.length;
        if (totalImageCount > MAX_IMAGE_COUNT) {
            setError('newImages', { message: `画像は${MAX_IMAGE_COUNT}枚まで投稿できます` });
            return;
        }


        setIsSubmitting(true);

        const imageFiles = data.newImages.map((img) => img.file);

        const handleFailure = (err: { message: string; isAuthError: boolean; fieldErrors?: Record<string, string[]> }) => {
            // 画像のバリデーションエラーをフォームに設定
            if (err.fieldErrors) {
                const imageErrorKeys = Object.keys(err.fieldErrors).filter(
                    key => key.startsWith('images')
                );

                const commentErrorKeys = Object.keys(err.fieldErrors).filter(
                    key => key.startsWith('comment')
                );
                const ratingErrorKeys = Object.keys(err.fieldErrors).filter(
                    key => key.startsWith('rating')
                );

                if (imageErrorKeys.length > 0) {
                    const firstImageError = err.fieldErrors[imageErrorKeys[0]];
                    if (firstImageError && firstImageError.length > 0) {
                        setError('newImages', { message: firstImageError[0] });
                    }
                }

                if (commentErrorKeys.length > 0) {
                    const firstCommentError = err.fieldErrors[commentErrorKeys[0]];
                    if (firstCommentError && firstCommentError.length > 0) {
                        setError('comment', { message: firstCommentError[0] });
                    }
                }

                if (ratingErrorKeys.length > 0) {
                    const firstRatingError = err.fieldErrors[ratingErrorKeys[0]];
                    if (firstRatingError && firstRatingError.length > 0) {
                        setError('comment', { message: firstRatingError[0] });
                    }
                }
            }

            if (err.isAuthError) {
                showModal("Error", "エラーが発生しました。", "セッションが切れました。\nログインをお願いします。");
            } else if (!err.fieldErrors) {
                showModal("Error", "エラーが発生しました。", err.message);
            }
        };

        if (isEditMode && review) {
            await ReviewService.update({
                params: {
                    locationId,
                    reviewId: review.id,
                    rating: data.rating,
                    comment: data.comment.trim(),
                    images: imageFiles.length > 0 ? imageFiles : undefined,
                    deleteImageIds: data.deleteImageIds.length > 0 ? data.deleteImageIds : undefined,
                },
                success: () => {
                    showModal("Success", "更新が完了しました。");
                },
                failure: handleFailure,
            });
        } else {
            await ReviewService.create({
                params: {
                    locationId,
                    rating: data.rating,
                    comment: data.comment.trim(),
                    images: imageFiles.length > 0 ? imageFiles : undefined,
                },
                success: () => {
                    showModal("Success", "投稿が完了しました。");
                },
                failure: handleFailure,
            });
        }

        setIsSubmitting(false);
    };

    return (
        <>
            <div className="w-full p-4 pt-20 pb-20  max-w-4xl h-screen bg-black mx-auto flex justify-center">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
                    <LocationSection
                        name={locationName}
                        imagePath={locationImagePath}
                    />

                    <RatingSection
                        rating={rating}
                        register={register("rating", {
                            min: { value: 0, message: "評価の値は0から5までの範囲でお願いします。" },
                            max: {
                                value: 5,
                                message: "評価の値は0から5までの範囲でお願いします。"
                            }
                        })}
                        onPlusClick={() => handleRatingChange(1)}
                        onMinusClick={() => handleRatingChange(-1)}
                        errorMessage={errors.rating?.message}
                    />

                    <TextArea
                        id="comment"
                        title="コメント"
                        rows={6}
                        placeholder="詳細な情報を教えてください。"
                        register={register("comment", {
                            required: "コメントを入力してください。",
                            maxLength: {
                                value: 300,
                                message: 'コメントは300文字以内にしてください。',
                            },
                            validate: (value) =>
                                value.trim().length > 0 || "コメントを入力してください",
                        })}
                        errorMessage={errors.comment?.message}
                    />

                    <ImageUploader
                        inputRef={fileInputRef}
                        existingImages={existingImages}
                        newPreviewImages={newImages.map((img) => img.preview)}
                        onImageSelect={handleImageSelect}
                        onRemoveExistingImage={isEditMode ? handleRemoveExistingImage : undefined}
                        onRemoveNewImage={handleRemoveNewImage}
                        errorMessage={errors.newImages?.message}
                    />

                    <SubmitButton isSubmitting={isSubmitting} isEditMode={isEditMode} />
                </form>

                {isSubmitting && <Loading message={isEditMode ? "更新中" : "投稿中"} />}
            </div>

            <Modal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
            />
        </>
    );
}
