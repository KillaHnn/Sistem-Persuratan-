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
            // classification foreign keys
            $table->unsignedBigInteger('klasifikasi_primer_id')->nullable()->after('handler_id');
            $table->unsignedBigInteger('klasifikasi_sekunder_id')->nullable()->after('klasifikasi_primer_id');
            $table->unsignedBigInteger('klasifikasi_tersier_id')->nullable()->after('klasifikasi_sekunder_id');
            

            // link to generated nomor surat
            $table->unsignedBigInteger('nomor_surat_id')->nullable()->after('nomor_surat');
            

            // extend status enum – MySQL requires redefining the column
                        $table->enum('status', [
                'draft',
                'awaiting_sekretariat',
                'sekretariat_validated',
                'kabag_validated',
                'signed',
                'ready_for_user',
                // legacy values retained for backward compatibility
                'menunggu',
                'diproses',
                'dikembalikan',
                'diverifikasi',
                'ditandatangani',
                'diarsipkan',
            ])->default('draft')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::table('surat_umum', function (Blueprint $table) {
            $table->dropColumn(['klasifikasi_primer_id', 'klasifikasi_sekunder_id', 'klasifikasi_tersier_id', 'nomor_surat_id']);

            $table->enum('status', [
                'menunggu',
                'diproses',
                'dikembalikan',
                'diverifikasi',
                'ditandatangani',
                'diarsipkan',
            ])->default('menunggu')->change();
        });

        Schema::enableForeignKeyConstraints();
    }
};