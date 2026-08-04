<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE surat_umum MODIFY COLUMN jenis_surat ENUM('undangan', 'surat_tugas', 'surat_pengantar', 'surat_keterangan', 'lainnya', 'surat_permohonan') NOT NULL");

        Schema::create('detail_surat_permohonan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_umum_id')->constrained('surat_umum')->onDelete('cascade');
            $table->text('permohonan');
            $table->string('tujuan_permohonan');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_surat_permohonan');
        
        DB::statement("ALTER TABLE surat_umum MODIFY COLUMN jenis_surat ENUM('undangan', 'surat_tugas', 'surat_pengantar', 'surat_keterangan', 'lainnya') NOT NULL");
    }
};
