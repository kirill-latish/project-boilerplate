<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Table: roles
 *
 * === Columns ===
 * @property int $id
 * @property string|null $code
 * @property string|null $name
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 *
 * === Relationships ===
 * @property-read \App\Models\RoleSystemPermission[]|\Illuminate\Database\Eloquent\Collection $roleSystemPermission
 * @property-read \App\Models\SystemPermission[]|\Illuminate\Database\Eloquent\Collection $permissions
 */
class Role extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
    ];

    protected $casts = [
    ];

    public static function getRules($id = null)
    {
        return [
            'code' => 'string|nullable',
            'name' => 'string|nullable',
        ];
    }

    /**
     * @return HasMany
     */
    public function roleSystemPermission(): HasMany
    {
        return $this->hasMany(RoleSystemPermission::class, 'role_id');
    }

    /**
     * @return BelongsToMany
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            SystemPermission::class,
            'role_system_permissions',
            'role_id',
            'system_permission_id'
        );
    }
}
