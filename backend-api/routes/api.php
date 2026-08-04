<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\LoginCredentialMiddleware;

Route::post('/login', [AuthController::class, 'login'])->middleware(LoginCredentialMiddleware::class);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    
    // User Management (Superadmin Only)
    Route::middleware('role:superadmin')->group(function () {
        Route::apiResource('users', App\Http\Controllers\UserController::class);
        Route::patch('users/{id}/toggle-active', [App\Http\Controllers\UserController::class, 'toggleActive']);
        Route::patch('users/{id}/reset-password', [App\Http\Controllers\UserController::class, 'resetPassword']);
    });

    // Classifications
    Route::get('klasifikasi/primer', [App\Http\Controllers\KlasifikasiController::class, 'getPrimers']);
    Route::get('klasifikasi/sekunder/{primer_id}', [App\Http\Controllers\KlasifikasiController::class, 'getSekunders']);
    Route::get('klasifikasi/tersier/{sekunder_id}', [App\Http\Controllers\KlasifikasiController::class, 'getTersiers']);
    
    Route::apiResource('nomor-surat', App\Http\Controllers\NomorSuratController::class);

    // ── AUTH: Logout ─────────────────────────────────
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // ── PERSURATAN UMUM (Module Baru) ────────────────
    Route::prefix('umum')->group(function () {

        // Surat CRUD
        Route::apiResource('surat', \App\Http\Controllers\SuratUmumController::class);

        // Alur Approval
        Route::prefix('surat/{id}')->group(function () {
            Route::post('proses',       [\App\Http\Controllers\ApprovalController::class, 'proses']);
            Route::post('verifikasi',   [\App\Http\Controllers\ApprovalController::class, 'verifikasi']);
            Route::post('kembalikan',   [\App\Http\Controllers\ApprovalController::class, 'kembalikan']);
            Route::post('paraf',        [\App\Http\Controllers\ApprovalController::class, 'paraf']);
            Route::post('tandatangan',  [\App\Http\Controllers\ApprovalController::class, 'tandatangan']);
            Route::post('arsipkan',[\App\Http\Controllers\ApprovalController::class, 'arsipkan']);
            Route::post('arsip',        [\App\Http\Controllers\ArsipSuratController::class, 'store']);

            // Dokumen per surat
            Route::get('dokumen',  [\App\Http\Controllers\DokumenSuratController::class, 'index']);
            Route::post('dokumen', [\App\Http\Controllers\DokumenSuratController::class, 'store']);
        });

        // Download / Preview File Dokumen
        Route::get('dokumen/{id}/file', [\App\Http\Controllers\DokumenSuratController::class, 'showFile']);

        // Notifikasi
        Route::get('notifikasi',              [\App\Http\Controllers\NotifikasiSuratController::class, 'index']);
        Route::patch('notifikasi/{nid}/read', [\App\Http\Controllers\NotifikasiSuratController::class, 'markRead']);
        Route::post('notifikasi/read-all',    [\App\Http\Controllers\NotifikasiSuratController::class, 'markAllRead']);

        // Arsip
        Route::get('arsip', [\App\Http\Controllers\ArsipSuratController::class, 'index']);

        // Buku Agenda Surat (Register)
        Route::apiResource('buku-agenda', \App\Http\Controllers\BukuAgendaSuratController::class);
        Route::get('buku-agenda-dropdown', [\App\Http\Controllers\BukuAgendaSuratController::class, 'getDropdownSurat']);
    });
});