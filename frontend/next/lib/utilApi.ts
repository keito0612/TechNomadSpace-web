import { error } from 'console';
import { ObjectKeys } from './../node_modules/react-hook-form/dist/types/path/common.d';
export class UtilApi {
    static API_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://localhost:8000';
    static selectedError(errors: { [key: string]: string[] }): { key: string, value: string } | null {
        if (Object.keys(errors).length !== 0) {
            //最初のエラー取得。
            const firstError = Object.entries(errors)[0];
            const key = firstError[0];
            const value = firstError[1][0];
            return { key: key, value: value }
        }
        return null;
    }
}