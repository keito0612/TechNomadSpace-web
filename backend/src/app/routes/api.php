<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get('profile/{id}', [UserController::class, 'profile']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('profile', [UserController::class, 'profile']);
    Route::prefix('user' )->group(function () {
        Route::get('/',[UserController::class. 'getUser']);
        Route::post('/edit', [UserController::class, 'edit']);
        Route::delete('/delete', [UserController::class, 'delete']);
    });
});
