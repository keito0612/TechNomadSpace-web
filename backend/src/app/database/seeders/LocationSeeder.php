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
        $locations =[
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
            ]
        ];

        foreach ($locations as $location) {
            Location::factory()
            ->has(Amenity::factory())
            ->has(UserReview::factory(4)->has(ReviewImage::factory(3))->count(3))
            ->create($location);
        }
    }
}
