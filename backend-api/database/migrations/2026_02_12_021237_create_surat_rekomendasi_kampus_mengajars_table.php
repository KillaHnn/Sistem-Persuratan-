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
        Schema::create('surat_rekomendasi_kampus_mengajars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('profile_m_h_s');
            $table->string('tahun_akademik');
            $table->string('semester');
            $table->string('jumlah_sks');
            $table->string('ipk');
            $table->string('file_pengantar_prodi');
            $table->string('file_surat_persetujuan');
            $table->string('file_sptjm');
            $table->string('file_transkrip_kumulatif');
            $table->string('file_keterangan_dokter');
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
        Schema::dropIfExists('surat_rekomendasi_kampus_mengajars');
    }
};
