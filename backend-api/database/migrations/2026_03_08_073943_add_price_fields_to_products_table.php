<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->decimal('cost_price', 12, 2)->nullable();
            $table->decimal('selling_price', 12, 2)->nullable();
            $table->decimal('promo_price', 12, 2)->nullable();

            $table->date('promo_start')->nullable();
            $table->date('promo_end')->nullable();

        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->dropColumn([
                'cost_price',
                'selling_price',
                'promo_price',
                'promo_start',
                'promo_end'
            ]);

        });
    }
};
