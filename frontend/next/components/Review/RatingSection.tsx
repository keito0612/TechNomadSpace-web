"use client";

import { UseFormRegisterReturn } from "react-hook-form";
import { Plus, Minus } from "lucide-react";
import { Button } from "@base-ui/react/button";
import StarsRatings from "../StarsRating";

interface RatingSectionProps {
    rating: number;
    register: UseFormRegisterReturn;
    onPlusClick: () => void;
    onMinusClick: () => void;
    errorMessage?: string;
}

const RatingButton = ({
    onClick,
    icon: Icon,
    label,
}: {
    onClick: () => void;
    icon: typeof Plus;
    label: string;
}) => {
    return (
        <Button
            onClick={onClick}
            aria-label={label}
            className="size-10 md:size-12 lg:size-14 rounded-full flex justify-center items-center border border-blue-700 bg-black hover:bg-gray-700"
        >
            <Icon className="text-blue-700" />
        </Button>
    );
};

export default function RatingSection({
    rating,
    register,
    onPlusClick,
    onMinusClick,
    errorMessage,
}: RatingSectionProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-2">評価</label>
            <input type="hidden" {...register} />
            <div className="flex flex-row justify-start gap-2 sm:gap-3 md:gap-3 lg:gap-3">
                <StarsRatings rating={rating} />
                <RatingButton onClick={onPlusClick} icon={Plus} label="評価を上げる" />
                <RatingButton onClick={onMinusClick} icon={Minus} label="評価を下げる" />
            </div>
            {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
            )}
        </div>
    );
}
