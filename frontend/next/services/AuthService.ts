
import { UtilApi } from "@/lib/utilApi";
import { CookieServise } from "./cookieServise";


const TOKEN_EXPIRY_DAYS = 7;

export class AuthService {
    static TOKEN_KEY = 'token';
    static async login<T>({ url, param, success, validetionError, failure }: { url: string, param: T, success: (token: string) => void, validetionError: (error: { key: string, value: string } | null) => void, failure: (error: string) => void }) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(param),
            });

            const data = await res.json();
            const token = data.token as string;
            if (res.ok) {
                success(token);
            } else {
                if (data.errors) {
                    validetionError(UtilApi.selectedError(data.errors));
                } else if (data.message) {
                    failure(data.message);
                }
            }
        } catch (error) {
            failure("予期しないエラーが発生しました");
            console.error('エラー発生', error);
        }
    }

    static async register<T>({ url, param, success, validetionError, failure }: { url: string, param: T, success: (token: string) => void, validetionError: (error: { key: string, value: string } | null) => void, failure: (error: string) => void }) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(param),
            });
            const data = await res.json();
            const token = data.token as string;
            if (res.ok) {
                success(token);
            } else {
                if (data.errors) {
                    validetionError(UtilApi.selectedError(data.errors));
                } else if (data.message) {
                    failure(data.message);
                }
            }
        } catch (error) {
            failure('想定外のエラーが発生しました。');
            console.error('エラー発生', error);
        }
    }


    static setSesstion(token: string) {
        CookieServise.setCookie(this.TOKEN_KEY, token, TOKEN_EXPIRY_DAYS);
    }

    static deleteSesstion() {
        CookieServise.deleteCookie(this.TOKEN_KEY);
    }

    static getSesstion(): string | null {
        if (typeof window !== 'undefined') {
            const token = CookieServise.getCookie(this.TOKEN_KEY);
            return token ?? null;
        }
        return null;
    }
}
