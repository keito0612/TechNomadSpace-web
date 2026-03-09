<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Amenity>
 */
class AmenityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'has_wifi' => fake()->boolean(),
            'has_power' => fake()->boolean(),
            'has_monitor' => fake()->boolean(),
            'has_private_booth' => fake()->boolean(),
            'has_free_drink' => fake()->boolean(),
            'wifi_speed_avg' => fake()->boolean()
        ];
    }
}
