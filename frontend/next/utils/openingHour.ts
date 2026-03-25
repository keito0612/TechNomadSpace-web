import { OpeningHour } from '@/types/types';
import { UtilDate } from './utilDate';

/**
 * 定休日を取得
 * @example "日曜日、月曜日" or "なし"
 */
export const getClosedDays = (openingHours: OpeningHour[]): string => {
    const closedDays = openingHours
        .filter(oh => oh.isClosed)
        .map(oh => UtilDate.DAY_NAMES[oh.dayOfWeek]);
    return closedDays.length > 0 ? closedDays.join('、') : 'なし';
};

/**
 * 今日の営業時間を取得
 * @example "日曜日 9時〜18時" or "休業日"
 */
export const getTodayHours = (openingHours: OpeningHour[]): string => {
    const today = UtilDate.getTodayDayOfWeek();
    const todayHours = openingHours.find(oh => oh.dayOfWeek === today);
    if (!todayHours || todayHours.isClosed) return '休業日';
    const openTime = UtilDate.formatTimeToJapanese(todayHours.openTime);
    const closeTime = UtilDate.formatTimeToJapanese(todayHours.closeTime);
    return `${UtilDate.DAY_NAMES[today]} ${openTime}〜${closeTime}`;
};

/**
 * 指定曜日の営業時間を取得
 * @example "月曜日 9時〜20時" or "休業日"
 */
export const getHoursByDay = (openingHours: OpeningHour[], dayOfWeek: number): string => {
    const hours = openingHours.find(oh => oh.dayOfWeek === dayOfWeek);
    if (!hours || hours.isClosed) return '休業日';
    const openTime = UtilDate.formatTimeToJapanese(hours.openTime);
    const closeTime = UtilDate.formatTimeToJapanese(hours.closeTime);
    return `${UtilDate.DAY_NAMES[dayOfWeek]} ${openTime}〜${closeTime}`;
};

/**
 * 全曜日の営業時間を取得（今日の曜日から順に並べる）
 * @example [{ day: "月曜日", hours: "9時〜20時", isToday: true }, ...]
 */
export const getAllHours = (openingHours: OpeningHour[]): { day: string; hours: string; isToday: boolean }[] => {
    const today = UtilDate.getTodayDayOfWeek();

    // 今日の曜日から順に並べる（0-6 → today, today+1, ..., today-1）
    const sortedHours = [...openingHours].sort((a, b) => {
        const aOffset = (a.dayOfWeek - today + 7) % 7;
        const bOffset = (b.dayOfWeek - today + 7) % 7;
        return aOffset - bOffset;
    });

    return sortedHours.map(oh => ({
        day: UtilDate.DAY_NAMES[oh.dayOfWeek],
        hours: oh.isClosed
            ? '休業日'
            : `${UtilDate.formatTimeToJapanese(oh.openTime)}〜${UtilDate.formatTimeToJapanese(oh.closeTime)}`,
        isToday: oh.dayOfWeek === today
    }));
};

/**
 * 現在営業中かどうかを判定
 */
export const isOpenNow = (openingHours: OpeningHour[]): boolean => {
    const today = UtilDate.getTodayDayOfWeek();
    const currentTime = UtilDate.getCurrentTime();

    const todayHours = openingHours.find(oh => oh.dayOfWeek === today);
    if (!todayHours || todayHours.isClosed || !todayHours.openTime || !todayHours.closeTime) {
        return false;
    }

    return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
};
