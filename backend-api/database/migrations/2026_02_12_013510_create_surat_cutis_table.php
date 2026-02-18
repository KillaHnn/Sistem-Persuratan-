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
        Schema::create('surat_cutis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('profile_m_h_s');
            $table->string('tahun_akademik');
            $table->string('semester');
            $table->string('tahun_akademik_cuti');
            $table->string('semester_cuti');
            $table->text('alasan_cuti');
            $table->string('file_pengajuan');
            $table->string('file_pengantar_prodi');
            $table->string('file_surat_keterangan');
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
        Schema::dropIfExists('surat_cutis');
    }
};
