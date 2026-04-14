<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserEditRequest;
use App\Models\User;
use App\Services\FileService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use League\Uri\Http;
use Symfony\Component\HttpFoundation\Response;


class UserController extends Controller
{

    private function userId(){
        return Auth::id();
    }
    function getUser()
    {
        $user = Auth::user();
        return response()->json([
            'user' => $user
        ], Response::HTTP_OK);
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
