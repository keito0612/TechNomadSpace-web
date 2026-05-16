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
        Schema::table('locations', function (Blueprint $table) {
            $table->integer('hourly_price')->nullable()->comment('1時間あたりの料金（円）');
            $table->integer('daily_price')->nullable()->comment('1日あたりの料金（円）');
            $table->integer('minimum_price')->nullable()->comment('最低利用料金（円）');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn(['hourly_price', 'daily_price', 'minimum_price']);
        });
    }
};
