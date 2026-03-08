<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_aliases', function (Blueprint $table) {

            $table->string('normalized_alias')
                ->nullable()
                ->after('alias');

            $table->index('normalized_alias', 'idx_alias_normalized');
        });

        // normalize existing data
        DB::statement("
            UPDATE product_aliases
            SET normalized_alias =
            UPPER(
                REPLACE(
                REPLACE(
                REPLACE(
                REPLACE(alias,'-',''),' ',''),'_',''),'.','')
            )
        ");
    }

    public function down(): void
    {
        Schema::table('product_aliases', function (Blueprint $table) {

            $table->dropIndex('idx_alias_normalized');
            $table->dropColumn('normalized_alias');

        });
    }
};