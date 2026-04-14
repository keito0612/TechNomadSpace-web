import { UtilApi } from "@/lib/utilApi";
import { AuthService } from "./AuthService";

export interface UserSetting {
    isEmail: boolean;
    isNotification: boolean;
}

export class SettingService {
    static async getSetting(): Promise<UserSetting | null> {
        try {
            const token = AuthService.getSesstion();
            const res = await fetch(`${UtilApi.API_URL}/api/setting`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                return null;
            }

            const data = await res.json();
            return data.setting;
        } catch {
            return null;
        }
    }

    static async updateSetting(setting: Partial<UserSetting>): Promise<{ success: boolean; setting?: UserSetting; message?: string }> {
        try {
            const token = AuthService.getSesstion();
            const res = await fetch(`${UtilApi.API_URL}/api/setting/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(setting),
            });

            if (!res.ok) {
                const error = await res.json();
                return { success: false, message: error.message || '設定の更新に失敗しました' };
            }

            const data = await res.json();
            return { success: true, setting: data.setting };
        } catch {
            return { success: false, message: '予期しないエラーが発生しました' };
        }
    }

    static async deleteAccount(): Promise<{ success: boolean; message?: string }> {
        try {
            const token = AuthService.getSesstion();
            const res = await fetch(`${UtilApi.API_URL}/api/user/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const error = await res.json();
                return { success: false, message: error.message || 'アカウントの削除に失敗しました' };
            }

            return { success: true };
        } catch {
            return { success: false, message: '予期しないエラーが発生しました' };
        }
    }
}
