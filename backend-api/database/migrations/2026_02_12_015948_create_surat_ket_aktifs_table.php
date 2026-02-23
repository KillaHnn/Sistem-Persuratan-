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
        Schema::create('surat_ket_aktifs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('profile_m_h_s');
            $table->foreignId('surat_cuti_id')->constrained('surat_cutis');
            $table->string('tahun_akademik');
            $table->string('semester');
            $table->date('tanggal_lapor');
            $table->string('tanggal_akademik_aktif');
            $table->string('file_pengantar');
            $table->string('file_surat_cuti');
            $table->string('file_spp');
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
        Schema::dropIfExists('surat_ket_aktifs');
    }
};
