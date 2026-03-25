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
            'locationId' => $this->locationId,
            'name' => $this->image_name,
            'photoUrl' => $this->image_path
        ];
    }
}
