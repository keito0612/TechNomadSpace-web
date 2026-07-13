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
        $user = User::inRandomOrder()->first() ?? User::factory()->create();
        $userId = $user->id;
        $comments = [
            'WiFiが安定していて作業が捗りました。また利用したいです。',
            '電源が各席にあって便利でした。コーヒーも美味しかったです。',
            '静かで集中できる環境でした。スタッフの対応も親切でした。',
            '立地が良く、駅から近いのが助かります。設備も充実しています。',
            '個室ブースがあるのでWeb会議にも最適です。',
            'フリードリンクがあってお得感があります。長時間作業に向いています。',
            '清潔感があり、快適に過ごせました。リピート確定です。',
            '料金がリーズナブルで、コスパが良いと思います。',
            '席の間隔が広くて、周りを気にせず作業できました。',
            '照明が明るすぎず暗すぎず、目が疲れにくいです。',
            '空調が効いていて、夏でも快適に作業できました。',
            'モニターを借りられるのが嬉しい。デュアルディスプレイで効率アップ。',
            '初めて利用しましたが、使い方も分かりやすかったです。',
            '混雑していることもありますが、平日午前は空いていて快適です。',
            '出張先で利用しました。急な作業スペース確保に助かりました。',
        ];
        $rating = fake()->numberBetween(3, 5);
        return [
            'user_id' => $userId,
            'comment' => fake()->randomElement($comments),
            'rating' => $rating
        ];
    }
}
