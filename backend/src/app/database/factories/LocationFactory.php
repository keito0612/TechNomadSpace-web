<?php

namespace Database\Factories;

use App\Enums\PriceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . 'カフェ',
            'address' => $this->faker->address(),
            'lat' => $this->faker->latitude(),
            'lng' => $this->faker->longitude(),
            'price_type' => $this->faker->randomElement(PriceType::cases())->value,
            'display_opening_hours' => json_encode([
                ['月曜日', '9時半〜18時半'],
                ['火曜日', '9時半〜18時半'],
            ]),
            'closed_days' => null,
            'phone_number' => $this->faker->phoneNumber(),
            'website_url' => $this->faker->url(),
        ];
    }
}
