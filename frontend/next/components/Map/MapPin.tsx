import { cn } from "@/lib/utils";
import { PriceType } from "@/types/types";
import { Coffee, Star, Zap } from "lucide-react";

interface MapPinProps {
    priceType: PriceType;
    isSelected?: boolean;
}

const getIconColor = (priceType: PriceType) => {
    switch (priceType) {
        case 0: // TotallyFree
            return "text-yellow-400"
        case 1: // DrinkOnly
            return "text-amber-600"
        case 2: // Paid
            return "text-[#01C4FF]"
    }
}

const PinIcon = ({ priceType, className, isSelected }: { priceType: PriceType, className: string, isSelected?: boolean }) => {
    const iconColor = getIconColor(priceType);
    const size = isSelected ? "size-9" : "size-7";
    switch (priceType) {
        case 0: // TotallyFree
            return (<Star className={cn(size, iconColor, className)} />);
        case 1: // DrinkOnly
            return (<Coffee className={cn(size, iconColor, className)} />);
        case 2: // Paid
            return (<Zap className={cn(size, iconColor, className)} />);
    }
}

const MapPin = ({ priceType, isSelected = false }: MapPinProps) => {
    return (
        <div className={cn(
            "flex flex-col justify-start bg-black items-center",
            isSelected ? "h-18 w-12 rounded-4xl" : "h-14 rounded-2xl"
        )}>
            <PinIcon priceType={priceType} className={"pt-2"} isSelected={isSelected} />
        </div>
    );
}

export default MapPin;