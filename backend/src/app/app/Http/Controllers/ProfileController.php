<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileEditBackgroundImage;
use App\Http\Requests\ProfileEditRequest;
use App\Http\Resources\ProfileResource;
use App\Models\User;
use App\Services\FileService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ProfileController extends Controller
{
    private $reviewRelations = ['user', 'images.review.user', 'location', 'likes'];

    private FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    private function userId(): string
    {
        return Auth::id();
    }

    public function profile()
    {
        $user = User::with([
            'reviews' => fn($query) => $query->with($this->reviewRelations),
            'likedReviews' => fn($query) => $query->with($this->reviewRelations),
        ])->find($this->userId());
        return ProfileResource::make($user)
        ->response()
        ->setStatusCode(Response::HTTP_OK);
    }

    public function edit(ProfileEditRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = User::find($this->userId());

            if (!$user) {
                return response()->json(['error' => 'user not found'], Response::HTTP_NOT_FOUND);
            }

            if ($request->hasFile('profileImage')) {
                $user->image_path = $this->fileService->replaceImage(
                    $user->image_path,
                    $request->file('profileImage'),
                    'profileImage'
                );
            }

            if ($request->hasFile('backgroundImage')) {
                $user->background_image_path = $this->fileService->replaceImage(
                    $user->background_image_path,
                    $request->file('backgroundImage'),
                    'backgroundImage'
                );
            }

            $user->name = $request->name;
            $user->comment = $request->comment;
            $user->save();
            DB::commit();

            return response()->json([
                'message' => 'User Edit Success'
            ], Response::HTTP_OK);

        } catch (Exception $e) {
            Log::debug($e);
            DB::rollBack();
            return response()->json([
                'message' => 'プロフィールの更新に失敗しました'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        $user = User::with([
            'reviews' => fn($query) => $query->with($this->reviewRelations),
            'likedReviews' => fn($query) => $query->with($this->reviewRelations),
        ])->find($id);

        if(is_null($user)){
            return response()->json([
                'message' => 'Profile Not Found',
            ],Response::HTTP_NOT_FOUND);
        }
        return ProfileResource::make($user)
        ->response()
        ->setStatusCode(Response::HTTP_OK);
    }
}
