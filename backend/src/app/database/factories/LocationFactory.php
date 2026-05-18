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
        $priceType = $this->faker->randomElement(PriceType::cases());

        return [
            'name' => $this->faker->company() . 'カフェ',
            'address' => $this->faker->address(),
            'lat' => $this->faker->latitude(),
            'lng' => $this->faker->longitude(),
            'price_type' => $priceType->value,
            'hourly_price' => $priceType === PriceType::Paid ? $this->faker->randomElement([300, 500, 800, 1000]) : null,
            'daily_price' => $priceType === PriceType::Paid ? $this->faker->randomElement([1000, 1500, 2000, 3000]) : null,
            'minimum_price' => $priceType === PriceType::DrinkOnly ? $this->faker->randomElement([300, 500, 600]) : null,
            'phone_number' => $this->faker->phoneNumber(),
            'website_url' => $this->faker->url(),
        ];
    }
}
