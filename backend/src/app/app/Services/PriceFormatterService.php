<?php

namespace App\Services;

use App\Enums\PriceType;
use App\Models\Location;

class PriceFormatterService
{
    public static function format(Location $location): string
    {
        return match ($location->price_type) {
            PriceType::TotallyFree => '無料',
            PriceType::DrinkOnly   => self::getDrinkOnlyPriceText($location),
            PriceType::Paid        => self::getPaidPriceText($location),
            default                => '料金情報なし',
        };
    }

    private static function getDrinkOnlyPriceText(Location $location): string
    {
        if ($location->minimum_price) {
            return "ドリンク注文で利用可能（{$location->minimum_price}円〜）";
        }
        return 'ドリンク注文で利用可能';
    }

    private static function getPaidPriceText(Location $location): string
    {
        $parts = [];

        if ($location->hourly_price) {
            $parts[] = number_format($location->hourly_price) . '円/1時間';
        }

        if ($location->daily_price) {
            $parts[] = number_format($location->daily_price) . '円/1日';
        }

        return empty($parts) ? '有料' : implode('、', $parts);
    }
}
