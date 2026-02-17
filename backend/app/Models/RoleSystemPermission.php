<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Table: role_system_permissions
 *
 * === Columns ===
 * @property int $id
 * @property int|null $role_id
 * @property int|null $system_permission_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 *
 * === Relationships ===
 * @property-read \App\Models\Role|null $role
 * @property-read \App\Models\SystemPermission|null $systemPermission
 */
class RoleSystemPermission extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'role_id',
        'system_permission_id',
    ];

    protected $casts = [
    ];

    public static function getRules($id = null)
    {
        return [
            'role_id' => 'numeric|required|exists:roles,id',
            'system_permission_id' => 'numeric|required|exists:system_permissions,id',
        ];
    }

    public function role()
    {
        return $this->belongsTo(\App\Models\Role::class);
    }

    public function systemPermission()
    {
        return $this->belongsTo(\App\Models\SystemPermission::class);
    }
}
