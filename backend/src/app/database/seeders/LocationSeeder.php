<?php

namespace Database\Seeders;

use App\Enums\PriceType;
use App\Models\Amenity;
use App\Models\Location;
use App\Models\ReviewImage;
use App\Models\User;
use App\Models\UserReview;
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
        $dummyLocations =[
            [
                "name" =>  "エンジニアカフェ",
                "address" => "福岡県福岡市中央区天神１丁目１５−３０",
                'lat' => 0.01,
                'lng'=> 0.01 ,
                'price_type' => PriceType::TotallyFree->value,
                'display_opening_hours' => json_encode([
                    ['月曜日','9時半〜18時半'],
                    ['火曜日','9時半〜18時半'],
                    ['水曜日','9時半〜18時半'],
                    ['木曜日','9時半〜18時半'],
                    ['金曜日','9時半〜18時半'],
                    ['土曜日','9時半〜18時半'],
                    ['日曜日','9時半〜18時半']
                ]),
                'closed_days' => null ,
                'phone_number' => '080-6742-7231',
                'website_url' => 'https://engineercafe.jp/ja/'
            ],
            [
                "name" =>  "OWNSPACE",
                "address" => "大分県大分市金池南１丁目５−１ コレジオ大分 1F",
                'lat' => 33.2361903,
                'lng'=> 131.6042767,
                'price_type' => PriceType::DrinkOnly->value,
                'display_opening_hours' => json_encode([
                    ['月曜日','10時〜19時'],
                    ['火曜日','10時〜19時'],
                    ['水曜日','10時〜19時'],
                    ['木曜日','10時〜19時'],
                    ['金曜日','10時〜19時'],
                    ['土曜日','10時半〜19時'],
                    ['日曜日','10時半〜19時']
                ]),
                'closed_days' => null ,
                'phone_number' => '097-554-5801',
                'website_url' => 'https://ownspace.me/'
            ],
            [
                "name" =>  "Oita Co.Lab Lounge（おおいたコラボラウンジ）",
                "address" => "大分県大分市金池町２丁目１−１０ ウォーカービル大分駅前 4F",
                'lat' => 33.2343061,
                'lng'=> 131.5857391,
                'price_type' => PriceType::Paid->value,
                'display_opening_hours' => json_encode([
                    ['月曜日','10時〜19時'],
                    ['火曜日','10時〜19時'],
                    ['水曜日','10時〜19時'],
                    ['木曜日','10時〜19時'],
                    ['金曜日','10時〜19時'],
                    ['土曜日','10時半〜19時'],
                    ['日曜日','10時半〜19時']
                ]),
                'closed_days' => null ,
                'phone_number' => null,
                'website_url' => 'https://oita-colab.com/'
            ],
            [
                "name" =>  "OWNSPACE",
                "address" => "大分県大分市金池南１丁目５−１ コレジオ大分 1F",
                'lat' => 33.2361903,
                'lng'=> 131.6042767,
                'price_type' => PriceType::DrinkOnly->value,
                'display_opening_hours' => json_encode([
                    ['月曜日','10時〜19時'],
                    ['火曜日','10時〜19時'],
                    ['水曜日','10時〜19時'],
                    ['木曜日','10時〜19時'],
                    ['金曜日','10時〜19時'],
                    ['土曜日','10時半〜19時'],
                    ['日曜日','10時半〜19時']
                ]),
                'closed_days' => null ,
                'phone_number' => '097-554-5801',
                'website_url' => 'https://ownspace.me/'
            ],
            [
                "name" =>  "大分銀行 コワーキングスペース ビジカム",
                "address" => "大分県大分市金池南１丁目５−１ コレジオ大分 1F",
                'lat' => 33.2157721,
                'lng'=> 131.6110746,
                'price_type' => PriceType::TotallyFree->value,
                'display_opening_hours' => json_encode([
                    ['月曜日','10時〜17時'],
                    ['火曜日','10時〜17時'],
                    ['水曜日','10時〜17時'],
                    ['木曜日','10時〜17時'],
                    ['金曜日','10時〜17時'],
                ]),
                'closed_days' => '土・日・祝',
                'phone_number' => null,
                'website_url' => 'https://pkg.navitime.co.jp/oitabank/spot/detail?code=0000000283'
            ]
        ];

        foreach ($dummyLocations as $location) {
            Location::factory()
            ->has(Amenity::factory(), 'amenity')
            ->has(
                UserReview::factory(3)
                    ->has(ReviewImage::factory(3), 'images'),
                'reviews'
            )
            ->create($location);
        }
    }
}
