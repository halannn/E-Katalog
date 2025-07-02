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
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Kolom ID (Primary Key, BigInt, Unsigned, Auto-Increment)

            $table->string('name', 255); // 📦 Nama produk, dengan batas 255 karakter
            $table->string('sku')->unique(); // 🏷️ SKU (Stock Keeping Unit), harus unik untuk setiap produk
            $table->text('description')->nullable(); // 📝 Deskripsi produk, boleh kosong (nullable)
            $table->decimal('price', 10); // 💰 Harga produk, misal 99999999.99
            $table->unsignedInteger('stock')->default(0); // 🔢 Jumlah stok, tidak boleh negatif, default-nya 0
            $table->string('image')->nullable(); // 🖼️ Path atau URL ke gambar produk, boleh kosong

            // Contoh kolom relasi (foreign key)
            $table->foreignId('category_id')
                ->constrained('categories') // Merujuk ke kolom 'id' di tabel 'categories'
                ->onDelete('cascade'); // Jika kategori dihapus, produk terkait juga akan terhapus

            // kolom untuk status
            $table->enum('status', ['Tersedia', 'Draft', 'Kosong'])->default('Draft');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
