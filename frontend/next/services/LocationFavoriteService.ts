import { UtilApi } from "@/lib/utilApi";
import { AuthService } from "./AuthService";
import { LocationData } from "@/types/location";

interface ToggleFavoriteResponse {
    isFavorited: boolean;
}

export class LocationFavoriteService {
    static async toggleFavorite({
        locationId,
        success,
        failure,
    }: {
        locationId: number;
        success: (response: ToggleFavoriteResponse) => void;
        failure: (error: { message: string; isAuthError: boolean }) => void;
    }): Promise<void> {
        try {
            const token = AuthService.getSesstion();

            const res = await fetch(`${UtilApi.API_URL}/api/locations/${locationId}/favorite`, {
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
                    failure({ message: 'お気に入りの更新に失敗しました', isAuthError: false });
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

    static async getFavoriteLocations(): Promise<LocationData[]> {
        const token = AuthService.getSesstion();

        const res = await fetch(`${UtilApi.API_URL}/api/user/favorite-locations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error('Failed to get favorite locations');
        }

        const data = await res.json();
        return data.data;
    }
}
