import Cookies from 'js-cookie';
export class CookieServise {
    static getCookie(name: string): string | undefined {
        return Cookies.get(name);
    }

    static getAllCookies(): Record<string, string> {
        return Cookies.get();
    }

    static setCookie(name: string, value: string, days?: number): void {
        Cookies.set(name, value, {
            expires: days,
            path: '/',
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    }

    static deleteCookie(name: string): void {
        Cookies.remove(name, { path: '/' });
    }
}