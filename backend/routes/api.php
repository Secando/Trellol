<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\ListController;
use Illuminate\Support\Facades\Route;

// Публичные маршруты аутентификации
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Защищенные маршруты
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Board routes
    Route::apiResource('boards', BoardController::class);

    // List routes
    Route::get('boards/{board}/lists', [ListController::class, 'index']);
    Route::post('boards/{board}/lists', [ListController::class, 'store']);
    Route::delete('/boards/{board}', [BoardController::class, 'destroy']);
    Route::patch('lists/{list}', [ListController::class, 'update']);
    Route::delete('/boards/{board}/lists/{list}', [ListController::class, 'destroy']);
    Route::put('boards/{board}/lists/reorder', [ListController::class, 'reorder']);

    // Card routes
    Route::post('boards/{board}/lists/{list}/cards', [CardController::class, 'store']);
    Route::put('boards/{board}/lists/{list}/cards/{card}', [CardController::class, 'update']);
    Route::delete('boards/{board}/lists/{list}/cards/{card}', [CardController::class, 'destroy']);
    Route::put('boards/{board}/cards/reorder', [CardController::class, 'reorder']);
});

// CSRF cookie route
Route::get('/csrf-cookie', function() {
    return response()->json(['message' => 'CSRF cookie set']);
})->middleware('web'); 