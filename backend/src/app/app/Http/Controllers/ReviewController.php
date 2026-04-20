<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewStoreRequest;
use App\Http\Resources\ReviewResource;
use App\Models\ReviewImage;
use App\Models\UserReview;
use App\Services\FileService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ReviewController extends Controller
{
    private FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }


    public function show($id)
    {
        $review = UserReview::with([
            'images'
        ])->find($id);

        if(is_null($review)){
            return response()->json([
                'message' => "Review Not Found"
            ], Response::HTTP_NOT_FOUND);
        }

        return ReviewResource::make($review)
        ->response()
        ->setStatusCode(Response::HTTP_OK);
    }

    public function store(ReviewStoreRequest $request)
    {
        DB::beginTransaction();
        try {
            $review = UserReview::create([
                'user_id' => Auth::id(),
                'location_id' => $request->location_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imagePath = $this->fileService->uploadImage($image, 'reviews');
                    ReviewImage::create([
                        'user_review_id' => $review->id,
                        'location_id' => $request->location_id,
                        'image_name' => $image->getClientOriginalName(),
                        'image_path' => $imagePath,
                    ]);
                }
            }
            DB::commit();
            return response()->json([
                'message' => 'レビューを投稿しました',
            ], Response::HTTP_CREATED);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'レビューの投稿に失敗しました',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(ReviewStoreRequest $request, UserReview $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'message' => '編集権限がありません',
            ], Response::HTTP_FORBIDDEN);
        }

        DB::beginTransaction();
        try {
            $review->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]);

            if ($request->has('delete_image_ids')) {
                $deleteIds = $request->delete_image_ids;
                $imagesToDelete = ReviewImage::whereIn('id', $deleteIds)
                    ->where('user_review_id', $review->id)
                    ->get();

                foreach ($imagesToDelete as $image) {
                    if ($image->image_path) {
                        $this->fileService->delete($image->image_path);
                    }
                    $image->delete();
                }
            }

            // 新しい画像がある場合
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $imagePath = $this->fileService->uploadImage($image, 'reviews');
                    ReviewImage::create([
                        'user_review_id' => $review->id,
                        'location_id' => $review->location_id,
                        'image_name' => $image->getClientOriginalName(),
                        'image_path' => $imagePath,
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'message' => 'レビューを更新しました',
            ], Response::HTTP_OK);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Review update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'レビューの更新に失敗しました',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function destroy(UserReview $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'message' => '削除権限がありません',
            ], Response::HTTP_FORBIDDEN);
        }

        DB::beginTransaction();
        try {
            foreach ($review->images as $image) {
                if ($image->image_path) {
                    $this->fileService->delete($image->image_path);
                }
                $image->delete();
            }

            $review->likes()->delete();
            $review->delete();
            DB::commit();
            return response()->json([
                'message' => 'レビューを削除しました',
            ], Response::HTTP_OK);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'レビューの削除に失敗しました',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
