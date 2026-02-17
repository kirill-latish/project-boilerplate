<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SystemPermission;
use Illuminate\Database\Seeder;

class SystemPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['code' => 'me_view', 'name' => 'View Own Profile'],
            ['code' => 'me_edit', 'name' => 'Edit Own Profile'],

            ['code' => 'role_view', 'name' => 'View Roles'],
            ['code' => 'role_edit', 'name' => 'Edit Roles'],
            ['code' => 'role_index', 'name' => 'List Roles'],
            ['code' => 'role_show', 'name' => 'View Role Details'],
            ['code' => 'role_store', 'name' => 'Create Roles'],
            ['code' => 'role_update', 'name' => 'Update Roles'],
            ['code' => 'role_destroy', 'name' => 'Delete Roles'],
            ['code' => 'role_sync_permissions', 'name' => 'Sync Role Permissions'],

            ['code' => 'systempermission_view', 'name' => 'View System Permissions'],
            ['code' => 'systempermission_edit', 'name' => 'Edit System Permissions'],
            ['code' => 'systempermission_index', 'name' => 'List System Permissions'],
            ['code' => 'systempermission_show', 'name' => 'View System Permission Details'],
            ['code' => 'systempermission_store', 'name' => 'Create System Permissions'],
            ['code' => 'systempermission_update', 'name' => 'Update System Permissions'],
            ['code' => 'systempermission_destroy', 'name' => 'Delete System Permissions'],
        ];

        foreach ($permissions as $permission) {
            SystemPermission::updateOrCreate(
                ['code' => $permission['code']],
                ['name' => $permission['name']]
            );
        }
    }
}
