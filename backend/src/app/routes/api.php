<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// 公開API
Route::get('users/{id}', [UserController::class, 'getUser']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('profile', [UserController::class, 'profile']);
    Route::prefix('users' )->group(function () {
        Route::post('/edit/{id}', [UserController::class, 'edit']);
        Route::delete('delete/{id}', [UserController::class, 'delete']);
    });
});
