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
        Schema::create('detail_surat_lainnya', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_umum_id')->constrained('surat_umum')->cascadeOnDelete();
            $table->text('deskripsi');
            $table->text('ditujukan_kepada')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_surat_lainnya');
    }
};
