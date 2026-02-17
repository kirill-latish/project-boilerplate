<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Table: user_roles
 *
 * === Columns ===
 * @property int $id
 * @property int|null $user_id
 * @property int|null $role_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 *
 * === Relationships ===
 * @property-read \App\Models\User|null $user
 * @property-read \App\Models\Role|null $role
 */
class UserRole extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'role_id',
    ];

    protected $casts = [
    ];

    public static function getRules($id = null)
    {
        return [
            'user_id' => 'numeric|required|exists:users,id',
            'role_id' => 'numeric|required|exists:roles,id',
        ];
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
}
