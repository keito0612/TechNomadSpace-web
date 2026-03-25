export class UtilDate {
    static readonly DAY_NAMES = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];

    /**
     * 時刻文字列を「〇時」「〇時半」形式に変換
     * @example "09:00" -> "9時"
     * @example "09:30" -> "9時半"
     * @example "14:00" -> "14時"
     */
    static formatTimeToJapanese(time: string | null): string {
        if (!time) return '';
        const [hours, minutes] = time.split(':').map(Number);
        const hourStr = `${hours}時`;
        if (minutes === 30) {
            return `${hourStr}半`;
        }
        if (minutes > 0) {
            return `${hourStr}${minutes}分`;
        }
        return hourStr;
    }

    /**
     * 現在の曜日を取得（0=日曜日）
     */
    static getTodayDayOfWeek(): number {
        return new Date().getDay();
    }

    /**
     * 現在時刻を"HH:MM"形式で取得
     */
    static getCurrentTime(): string {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
}
