<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;

class ReviewResource extends JsonResource
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
            'userId' => $this->user_id,
            'locationId' => $this->location_id,
            'comment' => $this->comment,
            'postedAtHuman' => $this->posted_at_human,
            'rating' => $this->rating,
            'photos' => ReviewImageResource::collection($this->images),
            'likeCount' => $this->likes()->count(),
            'isLiked' => $userId ? $this->resource->isLikedBy($userId) : false,
            'user' => new UserResource($this->user),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }

    private function getUserIdFromRequest(Request $request): ?int
    {
        // まず通常の認証を試す
        if ($request->user()) {
            Log::debug('ReviewResource: user from request->user(): ' . $request->user()->id);
            return $request->user()->id;
        }

        // Bearerトークンを直接パース
        $token = $request->bearerToken();
        if (!$token) {
            Log::debug('ReviewResource: No bearer token found');
            return null;
        }

        Log::debug('ReviewResource: Bearer token found: ' . substr($token, 0, 20) . '...');

        $accessToken = PersonalAccessToken::findToken($token);
        if (!$accessToken) {
            Log::debug('ReviewResource: Token not found in database');
            return null;
        }

        Log::debug('ReviewResource: User ID from token: ' . $accessToken->tokenable_id);
        return $accessToken->tokenable_id;
    }
}
