<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\LoginCredentialMiddleware;

Route::post('/login', [AuthController::class, 'login'])
    ->middleware(LoginCredentialMiddleware::class);
