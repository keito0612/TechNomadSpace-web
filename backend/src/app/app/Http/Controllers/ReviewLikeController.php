<?php

namespace App\Http\Controllers;

use App\Enums\NotificationType;
use App\Jobs\SendReviewLikeNotification;
use App\Models\Like;
use App\Models\Notification;
use App\Models\User;
use App\Models\UserReview;
use App\Notifications\ReviewLikeNotification;
use App\Services\FcmService;
use Exception;
use Google\Service\AndroidPublisher\Review;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
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
                $this->sendReviewLikeNotification($review, $user);
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

    private function sendReviewLikeNotification(UserReview $review, User $user)
    {
        $reviewOwner = $review->user;
        if ($reviewOwner->id !== $user->id && $reviewOwner->setting?->is_notifacation) {
            $locationName = $review->location->name;
            Notification::create([
                'user_id' => $reviewOwner->id,
                'type' => NotificationType::Like,
                'title' =>  '投稿にいいねされました',
                'content' => "{$user->name}さんがあなたが投稿した{$locationName}のレビューにいいねしました",
                'from_user_id' => $user->id,
                'review_id' => $review->id,
            ]);
            $reviewOwner->notify(new ReviewLikeNotification($user, $review));
        }
    }
}
