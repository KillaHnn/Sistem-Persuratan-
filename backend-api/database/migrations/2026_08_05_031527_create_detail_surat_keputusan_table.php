<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE surat_umum MODIFY COLUMN jenis_surat ENUM('undangan', 'surat_tugas', 'surat_pengantar', 'surat_keterangan', 'lainnya', 'surat_permohonan', 'surat_keputusan') NOT NULL");

        Schema::create('detail_surat_keputusan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_umum_id')->constrained('surat_umum')->onDelete('cascade');
            $table->enum('jenis_sk', ['Dekan', 'Rektor']);
            $table->string('tentang');
            $table->text('menimbang');
            $table->text('mengingat');
            $table->text('diktum_keputusan');
            $table->text('tembusan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_surat_keputusan');
        DB::statement("ALTER TABLE surat_umum MODIFY COLUMN jenis_surat ENUM('undangan', 'surat_tugas', 'surat_pengantar', 'surat_keterangan', 'lainnya', 'surat_permohonan') NOT NULL");
    }
};
