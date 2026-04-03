export type ResultType = "Normal" | "Success" | "Error" | "Warning";
export type MenuAction = "edit" | "delete";
export const NotificationType = {
    POST: "post",
    LIKE: "like",
    NOTICE: "notice",
} as const;

export type NotificationType =
    (typeof NotificationType)[keyof typeof NotificationType];

export type PriceType = 0 | 1 | 2; // 0: TotallyFree, 1: DrinkOnly, 2: Paid

export type LocationTabType = 'info' | 'review' | 'photo';
export type ProfileTabType = 'post' | 'like';

export type ProviderType = 'google' | 'twitter';
export type UserType = 'user' | 'admin';

export interface AuthForm {
    email: string;
    password: string;
}

export interface Profile {
    id: number;
    name: string;
    email: string;
    image_path: string | null;
    comment: string;
    liked_reviews_count: number;
    reviews_count: number;
    reviews: Review[];
    liked_reviews: Review[];
    likes: unknown[];
}

export interface Amenity {
    locationId: number;
    hasWifi: boolean;
    hasPower: boolean;
    hasMonitor: boolean;
    hasPrivateBooth: boolean;
    hasFreeDrink: boolean;
    wifiSpeedAvg: number;
}

export interface OpeningHour {
    id: number;
    locationId: number;
    dayOfWeek: number; // 0=日, 1=月, ..., 6=土
    openTime: string | null;
    closeTime: string | null;
    isClosed: boolean;
}

export interface UserSetting {
    email_notification: boolean;
}

export interface ChartData {
    name: string;
    score: number;
    fullMark: number;
}

export interface City {
    id: number;
    name: string;
    prefecture_id: number;
}

export interface Photo {
    id: number;
    reviewId: number;
    locationId: number;
    review: Review;
    name: string;
    photoUrl: string;
}


export interface User {
    id: number;
    name: string;
    type: UserType;
    image_path: string | null;
    commment: string;
}

export interface Prefecture {
    id: number;
    name: string;
};



export interface ReviewImage {
    id: number;
    review_id: number;
    review: Review | null;
    photo_url: string | null;
    created_at: string | null;
    updated_at: string | null;
};

export interface Review {
    id: number;
    user_id: number;
    Notification_id: number;
    comment: string;
    posted_at_human: string;
    prefecture: Prefecture;
    rating: number;
    photos: Photo[];
    likes: unknown[];
    user: User;
    created_at: string;
    updated_at: string;
};

export interface Notification {
    id: string;
    type: string;
    title: string;
    content: string;
    time: string;
    liked_by_user?: User | null;
}

