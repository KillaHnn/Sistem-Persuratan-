<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah kolom hasil_arsip ke tabel surat_umum.
     * Nilai: 'berhasil' (surat selesai ditandatangani, lalu diarsipkan)
     *        'ditolak'  (surat dikembalikan/ditolak, lalu diarsipkan)
     *        null       = belum diarsipkan
     */
    public function up(): void
    {
        Schema::table('surat_umum', function (Blueprint $table) {
            $table->enum('hasil_arsip', ['berhasil', 'ditolak'])->nullable()->after('tgl_selesai');
        });
    }

    public function down(): void
    {
        Schema::table('surat_umum', function (Blueprint $table) {
            $table->dropColumn('hasil_arsip');
        });
    }
};
