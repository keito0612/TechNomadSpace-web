<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'image_path' => $this->image_path ?? null,
            'background_image_path' => $this->background_image_path ?? null,
            'comment' => $this->comment,
            'reviews_count' => $this->reviews->count(),
            'liked_reviews_count' => $this->likedReviews->count(),
            'reviews' => ReviewResource::collection($this->reviews),
            'liked_reviews' => ReviewResource::collection($this->likedReviews),
        ];
    }
}
