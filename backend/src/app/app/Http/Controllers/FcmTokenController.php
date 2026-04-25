<?php

namespace App\Http\Controllers;

use App\Services\FcmService;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FcmTokenController extends Controller
{
    protected FcmService $fcmService;

    public function __construct(FcmService $fcmService)
    {
        $this->fcmService = $fcmService;
    }

    /**
     * FCMトークンを登録
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required|string',
            ]);

            $user = $request->user();
            $result = $this->fcmService->registerToken($user, $request->input('token'));

            if ($result) {
                return response()->json([
                    'message' => 'トークンを登録しました',
                ], Response::HTTP_OK);
            }

            return response()->json([
                'message' => 'トークンの登録に失敗しました',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * FCMトークンを削除
     */
    public function destroy(Request $request)
    {
        try {
            $user = $request->user();
            $result = $this->fcmService->removeToken($user);

            if ($result) {
                return response()->json([
                    'message' => 'トークンを削除しました',
                ], Response::HTTP_OK);
            }

            return response()->json([
                'message' => 'トークンの削除に失敗しました',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
