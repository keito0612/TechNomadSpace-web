<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            'userId' => $this->user_id,
            'locationId' => $this->location_id,
            'comment' => $this->comment,
            'postedAtHuman' => $this->posted_at_human,
            'rating' => $this->rating,
            'photos' => ReviewImageResource::collection($this->images),
            'likes' => $this->likes,
            'user' => new UserResource($this->user),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
