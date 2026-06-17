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
        Schema::create('dokumen_surats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_umum_id')->constrained('surat_umum')->cascadeOnDelete();
            $table->enum('tipe_dokumen', ['lampiran_pendukung', 'draft', 'draft_revisi', 'surat_paraf', 'surat_ttd']);
            $table->string('nama_file');
            $table->text('path_file');
            $table->integer('versi')->default(1);
            $table->foreignId('uploaded_by')->constrained('users');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen_surats');
    }
};
