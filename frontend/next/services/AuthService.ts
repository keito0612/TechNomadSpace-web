
import { UtilApi } from "@/lib/utilApi";
import { CookieServise } from "./cookieServise";

const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_DAYS = 7;

export class AuthService {

    static async login<T>({ url, param, success, validetionMessage, failure }: { url: string, param: T, success: (token: string) => void, validetionMessage: (message: string) => void, failure: (error: string) => void }) {
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
                    validetionMessage(UtilApi.selectedErrorMessage(['email', 'password'], data.errors));
                } else if (data.message) {
                    failure(data.message);
                }
            }
        } catch (error) {
            failure("予期しないエラーが発生しました");
            console.error('エラー発生', error);
        }
    }

    static async register<T>({ url, param, success, failure }: { url: string, param: T, success: (message: string, token: string) => void, failure: (error: [string] | string) => void }) {
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
                success("新規登録が完了しました。", token);
            } else {
                failure(data["errors"]);
            }
        } catch (error) {
            failure('想定外のエラーが発生しました。');
            console.error('エラー発生', error);
        }
    }


    static setSesstion(token: string) {
        CookieServise.setCookie(TOKEN_KEY, token, TOKEN_EXPIRY_DAYS);
    }

    static deleteSesstion() {
        CookieServise.deleteCookie(TOKEN_KEY);
    }

    static getSesstion(): string | null {
        if (typeof window !== 'undefined') {
            const token = CookieServise.getCookie(TOKEN_KEY);
            return token ?? null;
        }
        return null;
    }
}
