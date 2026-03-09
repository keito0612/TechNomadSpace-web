<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserReview;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserReview>
 */
class UserReviewFactory extends Factory
{

    protected $model = UserReview::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first()->id;
        $comment = fake()->text;
        $rating = fake()->numberBetween(0,5);
        return [
            'user_id' => $user,
            'comment' => $comment,
            'rating' => $rating
        ];
    }
}
