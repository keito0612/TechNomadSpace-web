<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Laravel\Sanctum\PersonalAccessToken;

class LocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $userId = $this->getUserIdFromRequest($request);

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
            'isFavorited' => $userId ? $this->isFavoritedBy($userId) : false,
        ];
    }

    private function getUserIdFromRequest(Request $request): ?int
    {
        // まず通常の認証を試す
        if ($request->user()) {
            return $request->user()->id;
        }

        // Bearerトークンを直接パース
        $token = $request->bearerToken();
        if (!$token) {
            return null;
        }

        $accessToken = PersonalAccessToken::findToken($token);
        if (!$accessToken) {
            return null;
        }

        return $accessToken->tokenable_id;
    }
}
