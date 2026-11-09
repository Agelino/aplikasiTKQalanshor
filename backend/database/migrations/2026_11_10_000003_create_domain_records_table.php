<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('domain_records', function (Blueprint $table) {
            $table->id();
            $table->string('resource', 80);
            $table->string('record_id', 150);
            $table->json('payload');
            $table->timestamps();
            $table->unique(['resource', 'record_id']);
            $table->index('resource');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('domain_records');
    }
};
