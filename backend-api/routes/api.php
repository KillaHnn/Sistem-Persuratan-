<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileMHSController;
use App\Http\Controllers\SuratCutiController;
use App\Http\Controllers\SuratTunjanganController;
use App\Http\Controllers\NomorSuratController;
use App\Http\Middleware\LoginCredentialMiddleware;

Route::post('/login', [AuthController::class, 'login'])->middleware(LoginCredentialMiddleware::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('profiles', ProfileMHSController::class);
    Route::apiResource('nomor-surat', NomorSuratController::class);
    
    // Classifications
    Route::get('klasifikasi/primer', [App\Http\Controllers\KlasifikasiController::class, 'getPrimers']);
    Route::get('klasifikasi/sekunder/{primer_id}', [App\Http\Controllers\KlasifikasiController::class, 'getSekunders']);
    Route::get('klasifikasi/tersier/{sekunder_id}', [App\Http\Controllers\KlasifikasiController::class, 'getTersiers']);
    
    Route::apiResource('surat-tunjangan', SuratTunjanganController::class);
    Route::apiResource('surat-cuti', SuratCutiController::class);
    Route::apiResource('surat-keterangan', App\Http\Controllers\SuratKeteranganController::class);
    Route::apiResource('surat-ket-aktif', App\Http\Controllers\SuratKetAktifController::class);
    Route::apiResource('surat-magang', App\Http\Controllers\SuratMagangController::class);
    Route::apiResource('surat-pengunduran-mhs', App\Http\Controllers\SuratPengunduranMHSController::class);
    Route::apiResource('surat-perpanjang-ms', App\Http\Controllers\SuratPerpanjangMSController::class);
    Route::apiResource('surat-rekomendasi-kampus-mengajar', App\Http\Controllers\SuratRekomendasiKampusMengajarController::class)->parameters(['surat-rekomendasi-kampus-mengajar' => 'surat']);
    
    // User Management (Admin only)
    Route::group(['middleware' => ['role:admin']], function () {
        Route::apiResource('users', \App\Http\Controllers\KelolaUserController::class);
    });

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
            Route::post('kirim-ke-user',[\App\Http\Controllers\ApprovalController::class, 'kirimKeUser']);
            Route::post('arsip',        [\App\Http\Controllers\ArsipSuratController::class, 'store']);

            // Dokumen per surat
            Route::get('dokumen',  [\App\Http\Controllers\DokumenSuratController::class, 'index']);
            Route::post('dokumen', [\App\Http\Controllers\DokumenSuratController::class, 'store']);
        });

        // Notifikasi
        Route::get('notifikasi',              [\App\Http\Controllers\NotifikasiSuratController::class, 'index']);
        Route::patch('notifikasi/{nid}/read', [\App\Http\Controllers\NotifikasiSuratController::class, 'markRead']);
        Route::post('notifikasi/read-all',    [\App\Http\Controllers\NotifikasiSuratController::class, 'markAllRead']);

        // Arsip
        Route::get('arsip', [\App\Http\Controllers\ArsipSuratController::class, 'index']);
    });
});