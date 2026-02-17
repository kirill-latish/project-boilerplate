<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Table: system_permissions
 *
 * === Columns ===
 * @property int $id
 * @property string $code
 * @property string|null $name
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class SystemPermission extends BaseModel
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
            'code' => 'string|required',
            'name' => 'string|nullable',
        ];
    }
}
