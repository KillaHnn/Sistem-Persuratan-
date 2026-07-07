<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ensure doctrine/dbal is installed for column modification
        Schema::table('arsip_surats', function (Blueprint $table) {
            $table->string('nomor_arsip')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('arsip_surats', function (Blueprint $table) {
            $table->string('nomor_arsip')->nullable(false)->change();
        });
    }
};
