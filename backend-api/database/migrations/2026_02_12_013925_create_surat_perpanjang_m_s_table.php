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
        Schema::create('surat_perpanjang_m_s', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('profile_m_h_s');
            $table->string('tahun_akademik');
            $table->string('semester');
            $table->string('dosen_pembimbing');
            $table->string('tahun_akhir_perpanjang');
            $table->string('file_table');
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
        Schema::dropIfExists('surat_perpanjang_m_s');
    }
};
