<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class NotificationController extends Controller
{


    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $perPage = 15;

            $notifications = Notification::forUser($user->id)
                ->with(
                    ['fromUser:id,name,image_path',
                    'review'
                ])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            // reviewからlocation_idのみを含める
            $notifications->getCollection()->transform(function ($notification) {
                if ($notification->review) {
                    $notification->review = [
                        'id' => $notification->review->id,
                        'location_id' => $notification->review->location_id,
                    ];
                }
                return $notification;
            });

            return response()->json([
                'data' => $notifications->items(),
                'pagination' => [
                    'current_page' => $notifications->currentPage(),
                    'last_page' => $notifications->lastPage(),
                    'per_page' => $notifications->perPage(),
                    'total' => $notifications->total(),
                    'has_more' => $notifications->hasMorePages(),
                ],
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function detail($id)
    {
        $notification = Notification::with(['fromUser:id,name,image_path', 'review'])->find($id);
        $user = Auth::user();
        if ($notification === null) {
            return response()->json([
                'message' => 'Notification Not Found'
            ], Response::HTTP_NOT_FOUND);
        }
        if ($notification->user_id !== $user->id) {
            return response()->json([
                'message' => '権限がありません'
            ], Response::HTTP_FORBIDDEN);
        }

        // 既読にする
        if (!$notification->is_read) {
            $notification->update(['is_read' => true]);
        }

        // reviewからlocation_idのみを含める
        if ($notification->review) {
            $notification->review = [
                'id' => $notification->review->id,
                'location_id' => $notification->review->location_id,
            ];
        }

        return response()->json([
            'notification' => $notification
        ], Response::HTTP_OK);
    }


    public function unreadCount(Request $request)
    {
        try {
            $user = $request->user();
            $count = Notification::forUser($user->id)->unread()->count();

            return response()->json([
                'unread_count' => $count,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function markAsRead(Request $request, Notification $notification)
    {
        try {
            $user = $request->user();

            if ($notification->user_id !== $user->id) {
                return response()->json([
                    'message' => '権限がありません'
                ], Response::HTTP_FORBIDDEN);
            }

            $notification->update(['is_read' => true]);

            return response()->json([
                'message' => '既読にしました'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();

            Notification::forUser($user->id)
                ->unread()
                ->update(['is_read' => true]);

            return response()->json([
                'message' => 'すべて既読にしました'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function deleteAll(Request $request)
    {
        try {
            $user = $request->user();

            Notification::forUser($user->id)->delete();

            return response()->json([
                'message' => 'すべての通知を削除しました'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function delete(Request $request, $id)
    {
        try {
            $user = $request->user();
            $notification = Notification::find($id);
            if ($notification->user_id !== $user->id) {
                return response()->json([
                    'message' => '権限がありません'
                ], Response::HTTP_FORBIDDEN);
            }

            $notification->delete();

            return response()->json([
                'message' => '通知を削除しました'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
