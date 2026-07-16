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
        Schema::create('nomor_surat_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('surat_umum_id');
            $table->unsignedBigInteger('nomor_surat_id')->nullable();
            $table->unsignedBigInteger('generated_by'); // user id
            $table->enum('status_step', [
                'draft',
                'awaiting_sekretariat',
                'sekretariat_validated',
                'kabag_validated',
                'signed',
                'ready_for_user',
            ]);
            $table->timestamp('generated_at')->useCurrent();
            $table->foreign('surat_umum_id')->references('id')->on('surat_umum')->cascadeOnDelete();
            $table->foreign('nomor_surat_id')->references('id')->on('nomor_surats')->nullOnDelete();
            $table->foreign('generated_by')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Explicitly drop foreign key constraints before dropping the table
        Schema::table('nomor_surat_histories', function (Blueprint $table) {
            $table->dropForeign(['surat_umum_id']);
            $table->dropForeign(['nomor_surat_id']);
            $table->dropForeign(['generated_by']);
        });
        Schema::dropIfExists('nomor_surat_histories');
    }
};
