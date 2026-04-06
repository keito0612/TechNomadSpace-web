<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserEditRequest;
use App\Models\User;
use App\Services\FileService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class ProfileController extends Controller
{
    private $reviewRelations = ['user', 'images', 'location', 'likes'];

    private FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    private function userId(): string{
        return Auth::id();
    }

    function profile()
    {
        $user = User::with([
            'reviews' => fn($query) => $query->with($this->reviewRelations),
            'likedReviews' => fn($query) => $query->with($this->reviewRelations),
        ])->find($this->userId());

        return response()->json([
            'profile' => $user
        ], Response::HTTP_OK);
    }

    function edit(UserEditRequest $request)
    {
        DB::beginTransaction();
        try{
            $user = User::find($this->userId());

            if (!$user) {
                return response()->json(['error' => 'user not found'], 404);
            }

            if(!is_null($user->image_path)){
                if($this->fileService->exists($user->image_path)){
                    $this->fileService->delete($user->image_path);
                }
            }

            if ($request->hasFile('userImage')) {
                $image = $request->file("userImage");
                $extension = $image->getClientOriginalExtension();
                $fileName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
                $directory = 'profileImage';
                $path = $this->fileService->upload($image, $directory,$fileName);
                $url  = $this->fileService->getUrl($path);
                $user->image_path = $url;
            }
            $user->name = $request->name;
            $user->comment = $request->comment;
            $user->save();
            DB::commit();
            return response()->json([
                'message' => "User Edit Success"
            ],Response::HTTP_OK);
        }catch(Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ],Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    function detail($id)
    {
        $user = User::with([
            'reviews' => fn($query) => $query->with($this->reviewRelations),
            'likedReviews' => fn($query) => $query->with($this->reviewRelations),
        ])->find($id);

        if(is_null($user)){
            return response()->json([
                'message' => 'User Not Found',
            ],Response::HTTP_NOT_FOUND);
        }
        return response()->json([
            'profile' => $user
        ], Response::HTTP_OK);
    }
}
