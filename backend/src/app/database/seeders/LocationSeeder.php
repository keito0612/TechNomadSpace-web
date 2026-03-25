<?php

namespace Database\Seeders;

use App\Enums\PriceType;
use App\Models\Amenity;
use App\Models\Location;
use App\Models\ReviewImage;
use App\Models\User;
use App\Models\UserReview;
use Database\Factories\OpeningHourFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dummyLocations = [
            [
                "name" => "エンジニアカフェ",
                "address" => "福岡県福岡市中央区天神１丁目１５−３０",
                'lat' => 33.2361903,
                'lng' => 131.6042767,
                'price_type' => PriceType::TotallyFree->value,
                'phone_number' => '080-6742-7231',
                'website_url' => 'https://engineercafe.jp/ja/'
            ],
            [
                "name" => "OWNSPACE",
                "address" => "大分県大分市金池南１丁目５−１ コレジオ大分 1F",
                'lat' => 33.2361903,
                'lng' => 131.6042767,
                'price_type' => PriceType::DrinkOnly->value,
                'phone_number' => '097-554-5801',
                'website_url' => 'https://ownspace.me/'
            ],
            [
                "name" => "Oita Co.Lab Lounge（おおいたコラボラウンジ）",
                "address" => "大分県大分市金池町２丁目１−１０ ウォーカービル大分駅前 4F",
                'lat' => 33.2343061,
                'lng' => 131.5857391,
                'price_type' => PriceType::Paid->value,
                'phone_number' => null,
                'website_url' => 'https://oita-colab.com/'
            ],
            [
                "name" => "大分銀行 コワーキングスペース ビジカム",
                "address" => "大分県大分市府内町２丁目１−４",
                'lat' => 33.2157721,
                'lng' => 131.6110746,
                'price_type' => PriceType::TotallyFree->value,
                'phone_number' => null,
                'website_url' => 'https://pkg.navitime.co.jp/oitabank/spot/detail?code=0000000283'
            ]
        ];

        foreach ($dummyLocations as $locationData) {
            $location = Location::factory()
                ->has(Amenity::factory(), 'amenity')
                ->create($locationData);

            // レビューと画像を手動で作成（location_idを設定するため）
            $reviews = UserReview::factory(3)->create([
                'location_id' => $location->id,
            ]);

            foreach ($reviews as $review) {
                ReviewImage::factory(3)->create([
                    'user_review_id' => $review->id,
                    'location_id' => $location->id,
                ]);
            }

            OpeningHourFactory::createWeekForLocation($location->id);
        }
    }
}
