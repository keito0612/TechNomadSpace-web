<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\LocationFavoriteController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get('profile/{id}', [UserController::class, 'profile']);
Route::get('locations', [LocationController::class, 'locations']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::prefix('auth')->group(function () {
    Route::get('/{provider}/redirect', [SocialAuthController::class, 'redirect']);
    Route::post('/{provider}/callback', [SocialAuthController::class, 'callback']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('profile', [UserController::class, 'profile']);
    Route::prefix('user')->group(function () {
        Route::get('/', [UserController::class, 'getUser']);
        Route::post('/edit', [UserController::class, 'edit']);
        Route::delete('/delete', [UserController::class, 'delete']);
    });
    Route::post('locations/{location}/favorite', [LocationFavoriteController::class, 'toggle']);
    Route::get('favorite_locations', [LocationFavoriteController::class, 'index']);
});
