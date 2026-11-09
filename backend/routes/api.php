<?php

use App\Http\Controllers\Api\SchoolDataController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/bootstrap', [SchoolDataController::class, 'bootstrap']);
    Route::get('/state', [SchoolDataController::class, 'state']);
    Route::put('/state/{key}', [SchoolDataController::class, 'saveState']);
    Route::delete('/state/{key}', [SchoolDataController::class, 'deleteState']);
    Route::get('/resources', [SchoolDataController::class, 'resources']);
    Route::get('/resources/{resource}', [SchoolDataController::class, 'resource']);
    Route::put('/resources/{resource}', [SchoolDataController::class, 'replaceResource']);
    Route::post('/resources/{resource}/items', [SchoolDataController::class, 'storeResourceItem']);
    Route::put('/resources/{resource}/items/{id}', [SchoolDataController::class, 'updateResourceItem']);
    Route::delete('/resources/{resource}/items/{id}', [SchoolDataController::class, 'destroyResourceItem']);
    Route::post('/login', [SchoolDataController::class, 'login']);

    Route::post('/teachers', [SchoolDataController::class, 'storeTeacher']);
    Route::put('/teachers/{teacher}', [SchoolDataController::class, 'updateTeacher']);
    Route::delete('/teachers/{teacher}', [SchoolDataController::class, 'destroyTeacher']);

    Route::post('/students', [SchoolDataController::class, 'storeStudent']);
    Route::put('/students/{student}', [SchoolDataController::class, 'updateStudent']);
    Route::delete('/students/{student}', [SchoolDataController::class, 'destroyStudent']);
});
