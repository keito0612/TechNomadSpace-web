<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
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
            'address' => $this->address,
            'phoneNumber' => $this->phone_number,
            'priceType' => $this->price_type?->value,
            'websiteUrl' => $this->website_url,
            'photos' => ReviewImageResource::collection($this->images),
            'rating' => $this->reviews->avg('rating') ?? 0,
            'openingHours' => OpeningHourResource::collection($this->openingHours),
            'amenity' => new AmenityResource($this->amenity),
            'reviews' => ReviewResource::collection($this->reviews),
            'position' => [$this->lat, $this->lng],
        ];
    }
}
