<?php

namespace Database\Factories;

use App\Models\OpeningHour;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OpeningHour>
 */
class OpeningHourFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $openHour = fake()->numberBetween(7, 11);
        $closeHour = fake()->numberBetween(17, 22);

        return [
            'day_of_week' => fake()->numberBetween(0, 6),
            'open_time' => sprintf('%02d:00:00', $openHour),
            'close_time' => sprintf('%02d:00:00', $closeHour),
            'is_closed' => false,
        ];
    }

    /**
     * 一週間分の営業時間を生成
     */
    public static function createWeekForLocation(int $locationId): void
    {
        $openHour = fake()->numberBetween(7, 11);
        $closeHour = fake()->numberBetween(17, 22);
        $isClosed  =  fake()->boolean(10);
        for ($day = 0; $day < 7; $day++) {
            OpeningHour::create([
                'location_id' => $locationId,
                'day_of_week' => $day,
                'open_time' => $isClosed ? null : sprintf('%02d:00:00', $openHour),
                'close_time' => $isClosed ? null  : sprintf('%02d:00:00', $closeHour),
                'is_closed' => $isClosed, // 10%の確率で休み
            ]);
        }
    }
}
