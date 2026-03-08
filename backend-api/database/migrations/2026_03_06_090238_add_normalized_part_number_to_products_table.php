<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->string('normalized_part_number')
                  ->nullable()
                  ->after('part_number');

            $table->index('normalized_part_number');

        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->dropIndex(['normalized_part_number']);
            $table->dropColumn('normalized_part_number');

        });
    }
};