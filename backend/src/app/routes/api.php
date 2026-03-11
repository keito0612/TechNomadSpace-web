<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get('users/{id}', [UserController::class, 'getUser']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('profile', [UserController::class, 'profile']);
    Route::prefix('users' )->group(function () {
        Route::post('/edit', [UserController::class, 'edit']);
        Route::delete('/delete', [UserController::class, 'delete']);
    });
});
