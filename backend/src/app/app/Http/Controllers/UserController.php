<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use League\Uri\Http;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    private function userId(){
        return optional(Auth::guard('api')->user())->id;
    }
    function getUser($id)
    {
        $user = User::with([
            'reviews' => function($query) {
                $query->with([
                    'user',
                    'images',
                    'location',
                    'likes',
                    'images',
                ]);
            },
            'likedReviews' => function($query){
                $query->with([
                    'user',
                    'images',
                    'location',
                    'likes',
                    'images'
                ]);
            }
        ])->find($id);

        if(is_null($user)){
            return response(['message' => 'User Not Found'],Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'user' => $user
        ], Response::HTTP_OK);
    }

    function profile(){
        if(is_null($this->userId())){
            return response()->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $user = User::with([
            'reviews' => function($query) {
                $query->with([
                    'user',
                    'images',
                    'location',
                    'likes',
                    'images',
                ]);
            },
            'likedReviews' => function($query){
                $query->with([
                    'user',
                    'images',
                    'location',
                    'likes',
                    'images'
                ]);
            }
        ])->find($this->userId());

        return response()->json([
            'user' => $user
        ], Response::HTTP_OK);
    }

    function edit($id)
    {
        DB::beginTransaction();
        try{
            $user = User::find($id);
            if(is_null($user)){
                return response(['message' => 'User Not Found'],Response::HTTP_NOT_FOUND);
            }
            DB::commit();
        }catch(Exception $e){
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ],Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    function delete($id)
    {
        DB::beginTransaction();
        try{
            $user = User::find($id);
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
