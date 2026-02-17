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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable()->unique();
            $table->string('name')->nullable();
            $table->timestamps();
        });

        Schema::create('system_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable()->unique();
            $table->string('name')->nullable();
            $table->timestamps();
        });

        Schema::create('role_system_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->nullable()->constrained();
            $table->foreignId('system_permission_id')->nullable()->constrained();
            $table->timestamps();
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->foreignId('role_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('role_system_permissions');
        Schema::dropIfExists('system_permissions');
        Schema::dropIfExists('roles');
    }
};
