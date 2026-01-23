<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PricingPlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        DB::table('pricing_plans')->upsert(
            [
                [
                    'name' => 'Free',
                    'slug' => 'free',
                    'description' => 'Perfect for getting started',
                    'monthly_price' => 0,
                    'yearly_price' => 0,
                    'currency' => 'USD',
                    'features' => json_encode([
                        '5 articles per month',
                        '3 videos per month',
                        'Basic AI suggestions',
                        'Community support',
                    ], JSON_THROW_ON_ERROR),
                    'cta_label' => 'Get started',
                    'cta_href' => '/sign-up',
                    'cta_variant' => 'outline',
                    'highlighted' => false,
                    'sort_order' => 10,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'name' => 'Pro',
                    'slug' => 'pro',
                    'description' => 'For serious content creators',
                    'monthly_price' => 29,
                    'yearly_price' => 290,
                    'currency' => 'USD',
                    'features' => json_encode([
                        'Unlimited articles',
                        'Unlimited videos',
                        'Advanced AI tools',
                        'Priority support',
                        'Export in multiple formats',
                        'Version history',
                    ], JSON_THROW_ON_ERROR),
                    'cta_label' => 'Upgrade',
                    'cta_href' => '/sign-up',
                    'cta_variant' => 'default',
                    'highlighted' => true,
                    'sort_order' => 20,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                [
                    'name' => 'Team',
                    'slug' => 'team',
                    'description' => 'For teams and studios',
                    'monthly_price' => 99,
                    'yearly_price' => 990,
                    'currency' => 'USD',
                    'features' => json_encode([
                        'Everything in Pro',
                        'Team collaboration',
                        'Shared workspaces',
                        'Advanced analytics',
                        'Custom integrations',
                        'Dedicated support',
                    ], JSON_THROW_ON_ERROR),
                    'cta_label' => 'Upgrade',
                    'cta_href' => '/sign-up',
                    'cta_variant' => 'outline',
                    'highlighted' => false,
                    'sort_order' => 30,
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            ],
            ['slug'],
            [
                'name',
                'description',
                'monthly_price',
                'yearly_price',
                'currency',
                'features',
                'cta_label',
                'cta_href',
                'cta_variant',
                'highlighted',
                'sort_order',
                'is_active',
                'updated_at',
            ]
        );
    }
}

