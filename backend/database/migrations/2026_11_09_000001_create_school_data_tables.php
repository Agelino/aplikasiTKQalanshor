<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->nullable()->unique();
            $table->string('nip')->nullable()->index();
            $table->string('status')->default('Aktif');
            $table->json('profile')->nullable();
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('username')->nullable()->index();
            $table->string('nis')->nullable()->index();
            $table->string('nisn')->nullable()->index();
            $table->string('status')->default('Aktif');
            $table->string('class_id')->nullable()->index();
            $table->string('rombel_id')->nullable()->index();
            $table->json('profile')->nullable();
            $table->timestamps();
        });

        Schema::create('classes', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->json('data')->nullable();
            $table->timestamps();
        });

        Schema::create('rombels', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('class_id')->nullable()->index();
            $table->json('data')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rombels');
        Schema::dropIfExists('classes');
        Schema::dropIfExists('students');
        Schema::dropIfExists('teachers');
    }
};
