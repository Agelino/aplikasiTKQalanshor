<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_state', function (Blueprint $table) {
            $table->string('state_key')->primary();
            $table->json('state_value');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('app_state');
    }
};
