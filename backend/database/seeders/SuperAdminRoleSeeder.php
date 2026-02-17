<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminRoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create or update Super Admin Role
        $superAdminRole = Role::updateOrCreate(
            ['code' => 'super_admin'],
            [
                'code' => 'super_admin',
                'name' => 'Super Administrator',
            ]
        );

        $this->command->info("Created/Updated role: {$superAdminRole->code} - {$superAdminRole->name}");

        // Find and assign super_admin role to specified user
        $userEmail = 'admin@test.com'; // TODO: change to your admin user's email
        $user = User::where('email', $userEmail)->first();

        if ($user) {
            // Check if user already has super_admin role
            if (!$user->roles->contains('id', $superAdminRole->id)) {
                $user->roles()->attach($superAdminRole->id);
                $this->command->info("Assigned super_admin role to user: {$userEmail}");
            } else {
                $this->command->info("User {$userEmail} already has super_admin role.");
            }
        } else {
            $this->command->warn("User with email {$userEmail} not found. Please create the user first or run this seeder after user registration.");
        }

        $this->command->info('Super admin role seeded successfully.');
    }
}
