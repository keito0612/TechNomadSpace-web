<?php

namespace App\Http\Controllers;

use App\Jobs\SendReviewLikeNotification;
use App\Models\Like;
use App\Models\User;
use App\Models\UserReview;
use App\Notifications\ReviewLikeNotification;
use App\Services\FcmService;
use Exception;
use Google\Service\AndroidPublisher\Review;
use Illuminate\Http\Request;
use Symfony\Component\CssSelector\Node\FunctionNode;
use Symfony\Component\HttpFoundation\Response;

class ReviewLikeController extends Controller
{
    protected FcmService $fcmService;

    public function __construct(FcmService $fcmService)
    {
        $this->fcmService = $fcmService;
    }

    public function toggle(Request $request, UserReview $review)
    {
        try {
            $user = $request->user();
            $userId = $user->id;

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

                // いいね通知を送信（自分自身へのいいねは除く）
                $reviewOwner = $review->user;
                if ($reviewOwner->id !== $user->id && $reviewOwner->setting?->is_notifacation) {
                    $reviewOwner->notify(new ReviewLikeNotification($user, $review));
                }
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
