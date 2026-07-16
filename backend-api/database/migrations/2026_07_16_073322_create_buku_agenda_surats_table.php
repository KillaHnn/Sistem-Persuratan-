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
        Schema::create('buku_agenda_surats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_umum_id')->nullable()->constrained('surat_umum')->nullOnDelete();
            $table->string('nomor_surat', 100);
            $table->date('tanggal_surat')->nullable();
            $table->string('jenis_surat', 100)->nullable();
            $table->text('perihal')->nullable();
            $table->text('keterangan')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buku_agenda_surats');
    }
};
