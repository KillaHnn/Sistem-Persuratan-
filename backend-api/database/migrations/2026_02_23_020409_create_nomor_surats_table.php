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
        Schema::create('nomor_surats', function (Blueprint $table) {
            $table->id();
            $table->string('klasifikasi_primer');
            $table->string('klasifikasi_sekunder');
            $table->string('klasifikasi_tersier');
            $table->string('jenis_arsip');
            $table->string('nomor_surat')->unique();
            $table->integer('nomor_urut');
            $table->string('kode_surat');
            $table->date('tanggal_surat');
            $table->string('hal_surat');
            $table->text('isi_surat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nomor_surats');
    }
};
