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
        /**
         * name
         * slug
         * description
         * monthly_price
         * yearly_price
         * currency
         * features
         * cta_label
         * cta_href
         * cta_variant
         * highlighted
         * sort_order
         * is_active
         */
        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();

            // Mirrors current frontend hardcoded pricing numbers (whole dollars).
            $table->unsignedInteger('monthly_price')->default(0);
            $table->unsignedInteger('yearly_price')->default(0);
            $table->char('currency', 3)->default('USD');

            // Array of feature strings (e.g. ["Unlimited articles", ...]).
            $table->json('features');

            $table->string('cta_label');
            $table->string('cta_href')->default('/sign-up');
            $table->string('cta_variant')->default('default');

            $table->boolean('highlighted')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);

            $table->index('is_active');
            $table->index('sort_order');
            $table->index('highlighted');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};

