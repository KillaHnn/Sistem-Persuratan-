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
        Schema::create('surat_umum', function (Blueprint $table) {
            $table->id();
            $table->enum('jenis_surat', ['undangan', 'surat_tugas', 'surat_pengantar', 'surat_keterangan', 'lainnya']);
            $table->text('perihal');
            $table->string('nomor_surat', 50)->unique()->nullable();
            $table->enum('status', [
                'menunggu',
                'diproses',
                'dikembalikan',
                'diverifikasi',
                'ditandatangani',
                'diarsipkan',
            ])->default('menunggu');
            $table->integer('revisi_ke')->default(0);
            $table->foreignId('pemohon_id')->constrained('users');
            $table->foreignId('handler_id')->nullable()->constrained('users');
            $table->timestamp('tgl_permohonan')->useCurrent();
            $table->timestamp('tgl_selesai')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_umum');
    }
};
