<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cross_references', function (Blueprint $table) {

            $table->id();

            $table->foreignId('product_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('brand')->nullable();

            $table->string('part_number');

            $table->string('normalized_part_number');

            $table->timestamps();

            $table->index('normalized_part_number');
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cross_references');
    }
};