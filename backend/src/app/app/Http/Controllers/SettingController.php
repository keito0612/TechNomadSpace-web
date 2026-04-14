<?php

namespace App\Http\Controllers;

use App\Models\UserSetting;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $setting = $user->setting;

        if (!$setting) {
            $setting = UserSetting::create([
                'user_id' => $user->id,
                'is_email' => true,
                'is_notifacation' => true,
            ]);
        }

        return response()->json([
            'setting' => [
                'isEmail' => $setting->is_email,
                'isNotification' => $setting->is_notifacation,
            ]
        ], Response::HTTP_OK);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'isEmail' => 'sometimes|boolean',
            'isNotification' => 'sometimes|boolean',
        ]);

        DB::beginTransaction();
        try {
            $user = $request->user();
            $setting = $user->setting;

            if (!$setting) {
                $setting = UserSetting::create([
                    'user_id' => $user->id,
                    'is_email' => $validated['isEmail'] ?? true,
                    'is_notifacation' => $validated['isNotification'] ?? true,
                ]);
            } else {
                if (isset($validated['isEmail'])) {
                    $setting->is_email = $validated['isEmail'];
                }
                if (isset($validated['isNotification'])) {
                    $setting->is_notifacation = $validated['isNotification'];
                }
                $setting->save();
            }

            DB::commit();

            return response()->json([
                'setting' => [
                    'isEmail' => $setting->is_email,
                    'isNotification' => $setting->is_notifacation,
                ]
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
