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
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // Kolom ID (Primary Key)

            $table->string('name', 100); // 🏷️ Nama kategori, misalnya "Elektronik", "Pakaian"
            $table->string('slug')->unique(); // 🔗 URL-friendly dari nama, harus unik
            $table->text('description')->nullable(); // 📝 Deskripsi singkat tentang kategori (opsional)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
