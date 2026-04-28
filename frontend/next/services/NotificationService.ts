import { UtilApi } from "@/lib/utilApi";
import { AuthService } from "./AuthService";
import { NotificationListResponse } from "@/types/types";

interface FailureError {
    message: string;
    isAuthError: boolean;
}

export class NotificationService {
    /**
     * 通知一覧を取得（ページネーション対応）
     */
    static async getNotifications({
        page = 1,
        success,
        failure,
    }: {
        page?: number;
        success: (response: NotificationListResponse) => void;
        failure: (error: FailureError) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            if (!token) {
                failure({ message: 'ログインが必要です', isAuthError: true });
                return;
            }

            const res = await fetch(`${UtilApi.API_URL}/api/notifications?page=${page}`, {
                method: 'GET',
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
                    failure({ message: '通知の取得に失敗しました', isAuthError: false });
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

    /**
     * 単一の通知を既読にする
     */
    static async markAsRead({
        notificationId,
        success,
        failure,
    }: {
        notificationId: number;
        success: () => void;
        failure: (error: FailureError) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            if (!token) {
                failure({ message: 'ログインが必要です', isAuthError: true });
                return;
            }

            const res = await fetch(`${UtilApi.API_URL}/api/notifications/${notificationId}/read`, {
                method: 'PATCH',
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
                    failure({ message: '既読にできませんでした', isAuthError: false });
                }
                return;
            }

            success();
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
            failure({ message, isAuthError: false });
        }
    }

    /**
     * すべての通知を既読にする
     */
    static async markAllAsRead({
        success,
        failure,
    }: {
        success: () => void;
        failure: (error: FailureError) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            if (!token) {
                failure({ message: 'ログインが必要です', isAuthError: true });
                return;
            }

            const res = await fetch(`${UtilApi.API_URL}/api/notifications/read_all`, {
                method: 'PATCH',
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
                    failure({ message: '既読にできませんでした', isAuthError: false });
                }
                return;
            }

            success();
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
            failure({ message, isAuthError: false });
        }
    }

    /**
     * すべての通知を削除する
     */
    static async deleteAll({
        success,
        failure,
    }: {
        success: () => void;
        failure: (error: FailureError) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            if (!token) {
                failure({ message: 'ログインが必要です', isAuthError: true });
                return;
            }

            const res = await fetch(`${UtilApi.API_URL}/api/notifications/delete_all`, {
                method: 'DELETE',
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
                    failure({ message: '通知の削除に失敗しました', isAuthError: false });
                }
                return;
            }

            success();
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
            failure({ message, isAuthError: false });
        }
    }

    /**
     * 単一の通知を削除する
     */
    static async delete({
        notificationId,
        success,
        failure,
    }: {
        notificationId: number;
        success: () => void;
        failure: (error: FailureError) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            if (!token) {
                failure({ message: 'ログインが必要です', isAuthError: true });
                return;
            }

            const res = await fetch(`${UtilApi.API_URL}/api/notifications/${notificationId}`, {
                method: 'DELETE',
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
                    failure({ message: '通知の削除に失敗しました', isAuthError: false });
                }
                return;
            }

            success();
        } catch (error) {
            const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
            failure({ message, isAuthError: false });
        }
    }
}
