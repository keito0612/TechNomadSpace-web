import { UtilApi } from "@/lib/utilApi";
import { AuthService } from "./AuthService";

interface ToggleLikeResponse {
    isLiked: boolean;
    likeCount: number;
}

export class ReviewLikeService {
    static async toggleLike({
        reviewId,
        success,
        failure,
    }: {
        reviewId: number;
        success: (response: ToggleLikeResponse) => void;
        failure: (error: { message: string; isAuthError: boolean }) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            const res = await fetch(`${UtilApi.API_URL}/api/reviews/${reviewId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    failure({ message: 'ログインが必要です', isAuthError: true });
                } else {
                    failure({ message: 'いいねの更新に失敗しました', isAuthError: false });
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
