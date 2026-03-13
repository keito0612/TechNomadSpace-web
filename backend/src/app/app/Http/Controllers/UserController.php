<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserEditRequest;
use App\Models\User;
use App\Services\FileService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use League\Uri\Http;
use Symfony\Component\HttpFoundation\Response;


class UserController extends Controller
{
    private FileService $fileService;
    private $reviewRelations = ['user', 'images', 'location', 'likes'];

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    private function userId(){
        return optional(Auth::guard('api')->user())->id;
    }
    function getUser($id)
    {
        $user = User::with([
            'reviews' => fn($query) => $query->with($this->reviewRelations),
            'likedReviews' => fn($query) => $query->with($this->reviewRelations),
        ])->find($id);

        if(is_null($user)){
            return response(['message' => 'User Not Found'],Response::HTTP_NOT_FOUND);
        }
        return response()->json([
            'user' => $user
        ], Response::HTTP_OK);
    }

    function profile()
    {
        if(is_null($this->userId())){
            return response()->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $user = User::with([
            'reviews' => fn($query) => $query->with($this->reviewRelations),
            'likedReviews' => fn($query) => $query->with($this->reviewRelations),
        ])->find($this->userId());

        return response()->json([
            'user' => $user
        ], Response::HTTP_OK);
    }

    function edit(UserEditRequest $request)
    {
        DB::beginTransaction();
        try{
            $user = User::find( $this->userId());
            if (!$user) {
                return response()->json(['error' => 'user not found'], 404);
            }
            if ($request->hasFile('userImage')) {
                if(!is_null($user->image_path)){
                    if($this->fileService->exists($user->image_path)){
                        $this->fileService->delete($user->image_path);
                    }
                }
                $image = $request->file("userImage");
                $extension = $image->getClientOriginalExtension();
                // 英数字＋タイムスタンプのファイル名生成
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
        }catch(Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ],Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    function delete()
    {
        DB::beginTransaction();
        try{
            $user = User::find($this->userId());
            if(is_null($user)){
                return response(['message' => 'User Not Found'],Response::HTTP_NOT_FOUND);
            }
            $user->delete();
            return response(['mesaage' => 'User Delete Success'],Response::HTTP_OK);
        }catch(Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ],Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


}
