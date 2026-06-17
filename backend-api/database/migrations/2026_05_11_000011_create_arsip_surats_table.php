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
        Schema::create('arsip_surats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_umum_id')->unique()->constrained('surat_umum');
            $table->string('nomor_arsip', 50)->unique();
            $table->string('lokasi_fisik', 200)->nullable();
            $table->text('path_digital');
            $table->foreignId('dibuat_oleh')->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arsip_surats');
    }
};
