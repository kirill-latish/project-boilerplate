<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArticlesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        // Get all user IDs, or create a test user if none exist
        $userIds = User::pluck('id')->toArray();
        
        if (empty($userIds)) {
            // Create a test user if no users exist
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
            ]);
            $userIds = [$user->id];
        }

        $states = ['draft', 'published', 'archived'];
        $articles = [];

        for ($i = 0; $i < 100; $i++) {
            $state = $faker->randomElement($states);
            $publishedAt = null;

            // If published, set a published_at date
            if ($state === 'published') {
                $publishedAt = $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d H:i:s');
            } elseif ($faker->boolean(30)) {
                // 30% chance of having a published_at even if not published
                $publishedAt = $faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d H:i:s');
            }

            $articles[] = [
                'title' => $faker->sentence($faker->numberBetween(3, 8)),
                'user_id' => $faker->randomElement($userIds),
                'sub_title' => $faker->boolean(70) ? $faker->sentence($faker->numberBetween(4, 10)) : null,
                'state' => $state,
                'content' => $faker->boolean(80) ? $faker->paragraphs($faker->numberBetween(2, 8), true) : null,
                'published_at' => $publishedAt,
                'created_at' => $faker->dateTimeBetween('-1 year', 'now'),
                'updated_at' => now(),
            ];
        }

        // Insert articles in batches for better performance
        foreach (array_chunk($articles, 50) as $chunk) {
            Article::insert($chunk);
        }

        $this->command->info('Created 100 articles successfully!');
    }
}
