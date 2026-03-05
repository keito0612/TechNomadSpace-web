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
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->boolean('has_wifi')->default(false);
            $table->boolean('has_power')->default(false);
            $table->boolean('has_monitor')->default(false);
            $table->boolean('has_private_booth')->default(false);
            $table->boolean('has_free_drink')->default(false);
            $table->integer('wifi_speed_avg')->nullable()->comment('wifiのスピード数値');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('amenities');
    }
};
