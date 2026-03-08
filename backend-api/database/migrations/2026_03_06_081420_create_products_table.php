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
            $table->id();

            $table->unsignedBigInteger('phppos_item_id')->nullable();

            $table->string('name');
            $table->string('slug')->unique();

            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();

            $table->string('part_number')->nullable()->index();
            $table->string('barcode')->nullable()->index();

            $table->text('public_description')->nullable();

            $table->decimal('price', 12, 2)->nullable();

            $table->string('primary_image_url')->nullable();

            $table->boolean('is_active')->default(true);

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
