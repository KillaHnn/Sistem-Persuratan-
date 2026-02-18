<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('surat_pengunduran_m_h_s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('profile_m_h_s');
            $table->string('tahun_akademik');
            $table->string('semester');
            $table->string('thn_akademik_pengunduran');
            $table->string('tanggal_pengunduran');
            $table->string('tanggal_terakhi_aktif');
            $table->string('file_ktm');
            $table->string('file_pengajuan');
            $table->string('file_pengantar_prodi');
            $table->string('status')->default('pending');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_pengunduran_m_h_s');
    }
};
