import { UtilApi } from "@/lib/utilApi";
import { AuthService } from "./AuthService";
import { Review } from "@/types/types";

interface CreateReviewParams {
    locationId: number;
    rating: number;
    comment: string;
    images?: File[];
}

interface UpdateReviewParams {
    locationId: number;
    reviewId: number;
    rating: number;
    comment: string;
    images?: File[];
    deleteImageIds?: number[];
}

interface CreateReviewResponse {
    message: string;
    review: Review;
}

interface UpdateReviewResponse {
    message: string;
}

interface DeleteReviewResponse {
    message: string;
}

interface ValidationErrors {
    [key: string]: string[];
}

interface FailureError {
    message: string;
    isAuthError: boolean;
    fieldErrors?: ValidationErrors;
}

export class ReviewService {
    static async create({
        params,
        success,
        failure,
    }: {
        params: CreateReviewParams;
        success: (response: CreateReviewResponse) => void;
        failure: (error: FailureError) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            if (!token) {
                failure({ message: 'ログインが必要です', isAuthError: true });
                return;
            }

            const formData = new FormData();
            formData.append('location_id', params.locationId.toString());
            formData.append('rating', params.rating.toString());
            formData.append('comment', params.comment);

            if (params.images) {
                params.images.forEach((image) => {
                    formData.append('images[]', image);
                });
            }

            const res = await fetch(`${UtilApi.API_URL}/api/reviews/store`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                if (res.status === 401) {
                    failure({ message: 'ログインが必要です', isAuthError: true });
                } else if (res.status === 422) {
                    const data = await res.json();
                    const fieldErrors: ValidationErrors = data.errors || {};
                    const firstError = Object.values(fieldErrors)[0];
                    const message = Array.isArray(firstError) ? firstError[0] : 'バリデーションエラー';
                    failure({ message, isAuthError: false, fieldErrors });
                } else {
                    failure({ message: 'レビューの投稿に失敗しました', isAuthError: false });
                }
                return;
            }

            const data = await res.json();
            success(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
            failure({ message, isAuthError: false });
        }
    }

    static async update({
        params,
        success,
        failure,
    }: {
        params: UpdateReviewParams;
        success: (response: UpdateReviewResponse) => void;
        failure: (error: FailureError) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            if (!token) {
                failure({ message: 'ログインが必要です', isAuthError: true });
                return;
            }

            const formData = new FormData();
            formData.append('location_id', params.locationId.toString());
            formData.append('rating', params.rating.toString());
            formData.append('comment', params.comment);

            if (params.images && params.images.length > 0) {
                params.images.forEach((image) => {
                    formData.append('images[]', image);
                });
            }

            if (params.deleteImageIds && params.deleteImageIds.length > 0) {
                params.deleteImageIds.forEach((id) => {
                    formData.append('delete_image_ids[]', id.toString());
                });
            }

            const res = await fetch(`${UtilApi.API_URL}/api/reviews/update/${params.reviewId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                if (res.status === 401) {
                    failure({ message: 'ログインが必要です', isAuthError: true });
                } else if (res.status === 403) {
                    failure({ message: '編集権限がありません', isAuthError: false });
                } else if (res.status === 422) {
                    const data = await res.json();
                    const fieldErrors: ValidationErrors = data.errors || {};
                    const firstError = Object.values(fieldErrors)[0];
                    const message = Array.isArray(firstError) ? firstError[0] : 'バリデーションエラー';
                    failure({ message, isAuthError: false, fieldErrors });
                } else {
                    failure({ message: 'レビューの更新に失敗しました', isAuthError: false });
                }
                return;
            }

            const data = await res.json();
            success(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
            failure({ message, isAuthError: false });
        }
    }

    static async delete({
        reviewId,
        success,
        failure,
    }: {
        reviewId: number;
        success: (response: DeleteReviewResponse) => void;
        failure: (error: { message: string; isAuthError: boolean }) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            if (!token) {
                failure({ message: 'ログインが必要です', isAuthError: true });
                return;
            }

            const res = await fetch(`${UtilApi.API_URL}/api/reviews/destroy/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    failure({ message: 'ログインが必要です', isAuthError: true });
                } else if (res.status === 403) {
                    failure({ message: '削除権限がありません', isAuthError: false });
                } else {
                    failure({ message: 'レビューの削除に失敗しました', isAuthError: false });
                }
                return;
            }

            const data = await res.json();
            success(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
            failure({ message, isAuthError: false });
        }
    }
}
