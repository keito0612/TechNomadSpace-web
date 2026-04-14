<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\LocationFavoriteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewLikeController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('profile/detail/{id}', [ProfileController::class, 'detail']);
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


Route::get('locations', [LocationController::class, 'index']);
Route::get('location/{id}', [LocationController::class, 'location']);



Route::prefix('auth')->group(function () {
    Route::get('/{provider}/redirect', [SocialAuthController::class, 'redirect']);
    Route::post('/{provider}/callback', [SocialAuthController::class, 'callback']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::prefix('profile')->group(function(){
        Route::get('/', [ProfileController::class,'profile']);
        Route::post('/edit', [ProfileController::class,'edit']);
        Route::post('/edit/background_image',[ProfileController::class, 'editBackgroundImage']);
    });
    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'getUser']);
        Route::post('/edit', [UserController::class, 'edit']);
        Route::delete('/delete', [UserController::class, 'delete']);
    });
    Route::prefix('setting')->group(function () {
        Route::get('/', [SettingController::class, 'index']);
        Route::post('/update', [SettingController::class, 'update']);
    });
    Route::post('locations/{location}/favorite', [LocationFavoriteController::class, 'toggle']);
    Route::get('favorite_locations', [LocationFavoriteController::class, 'index']);
    Route::post('reviews/{review}/like', [ReviewLikeController::class, 'toggle']);
});
