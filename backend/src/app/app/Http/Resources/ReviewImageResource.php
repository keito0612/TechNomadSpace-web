<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reviewId' => $this->user_review_id,
            'locationId' => $this->location_id,
            'name' => $this->image_name,
            'photoUrl' => $this->image_path,
            // reviewは循環参照を避けるため、必要なフィールドのみ展開
            'review' => $this->when($this->relationLoaded('review'), function () {
                return [
                    'id' => $this->review->id,
                    'userId' => $this->review->user_id,
                    'comment' => $this->review->comment,
                    'postedAtHuman' => $this->review->posted_at_human,
                    'rating' => $this->review->rating,
                    'user' => $this->when($this->review->relationLoaded('user'), function () {
                        return new UserResource($this->review->user);
                    }),
                ];
            }),
        ];
    }
}
