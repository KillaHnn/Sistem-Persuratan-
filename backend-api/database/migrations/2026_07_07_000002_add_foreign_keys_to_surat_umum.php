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
        Schema::table('surat_umum', function (Blueprint $table) {
            $table->foreign('klasifikasi_primer_id')
                ->references('id')
                ->on('klasifikasi_primers')
                ->onDelete('set null');
            $table->foreign('klasifikasi_sekunder_id')
                ->references('id')
                ->on('klasifikasi_sekunders')
                ->onDelete('set null');
            $table->foreign('klasifikasi_tersier_id')
                ->references('id')
                ->on('klasifikasi_tersiers')
                ->onDelete('set null');
            $table->foreign('nomor_surat_id')
                ->references('id')
                ->on('nomor_surats')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_umum', function (Blueprint $table) {
            $table->dropForeign(['klasifikasi_primer_id']);
            $table->dropForeign(['klasifikasi_sekunder_id']);
            $table->dropForeign(['klasifikasi_tersier_id']);
            $table->dropForeign(['nomor_surat_id']);
        });
    }
};
