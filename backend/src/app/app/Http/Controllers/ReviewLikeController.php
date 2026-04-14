<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\UserReview;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReviewLikeController extends Controller
{
    public function toggle(Request $request, UserReview $review)
    {
        try {
            $userId = $request->user()->id;

            $exists = Like::where('user_id', $userId)
                ->where('user_review_id', $review->id)
                ->exists();

            if ($exists) {
                Like::where('user_id', $userId)
                    ->where('user_review_id', $review->id)
                    ->delete();
                $isLiked = false;
            } else {
                Like::create([
                    'user_id' => $userId,
                    'user_review_id' => $review->id,
                ]);
                $isLiked = true;
            }

            $likeCount = Like::where('user_review_id', $review->id)->count();

            return response()->json([
                'isLiked' => $isLiked,
                'likeCount' => $likeCount,
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
