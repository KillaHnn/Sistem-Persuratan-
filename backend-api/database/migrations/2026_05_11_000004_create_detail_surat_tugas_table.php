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
        Schema::create('detail_surat_tugas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_umum_id')->constrained('surat_umum')->cascadeOnDelete();
            $table->string('nama_ditugaskan');
            $table->string('nip')->nullable();
            $table->string('jabatan');
            $table->text('tujuan_tugas');
            $table->string('tempat_tugas');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->text('dasar_penugasan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_surat_tugas');
    }
};
