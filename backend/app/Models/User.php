<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Table: users
 *
 * === Columns ===
 * @property int $id
 * @property string|null $name
 * @property string|null $email
 * @property string|null $password
 * @property string|null $state
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 *
 * === Relationships ===
 * @property-read \App\Models\Role[]|\Illuminate\Database\Eloquent\Collection $roles
 */

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public const STATE_ACTIVE = 'active';
    public const STATE_INACTIVE = 'inactive';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'state',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Add this relationship inside class User
    /**
     * @return BelongsToMany
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

// Optional helper (used often in admin tooling)
    public function isAdmin(): bool
    {
        // Requires roles relation to be loaded OR will lazy-load it
        return $this->roles()->where('code', 'super_admin')->exists();
    }

    public function checkPermission($action, $model, $requestMethod, $requestParameters)
    {

        $result = [
            'status' => 'allowed',
            'message' => trans('all necessary permissions are there')
        ];

        switch ($requestMethod) {
            case 'GET':
                $permission_suffix = 'view';
                break;
            case 'POST':
            case 'PUT':
            case 'PATCH':
            case 'DELETE':
                $permission_suffix = 'edit';
                break;
            default:
                return $result;
                break;
        }

        $neededPermissions = [];

        $model = strtolower($model);

        $neededPermissions[] = $model . '_' . $permission_suffix;
        $neededPermissions[] = $model . '_' . $action;


        if (in_array($action, ['update', 'store'])) {
            foreach ($requestParameters as $key => $value) {
                $neededPermissions[] = $model . '_edit_' . $key; // service_appointment_edit_fieldname
                $neededPermissions[] = $model . '_' . $action . '_' . $key; // service_appointment_update_fieldname

                // Skip array values (like file uploads) for permission checks
                if (!is_array($value)) {
                    $neededPermissions[] = $model . '_edit_' . $key . "_to_" . $value; // service_appointment_edit_fieldname_to_value
                    $neededPermissions[] = $model . '_' . $action . '_' . $key . "_to_" . $value; // service_appointment_update_fieldname_to_value
                }
            }
        }

        // get permissions that exist in the system
        $permissions = SystemPermission::whereIn('code', $neededPermissions)->get()->pluck('code')->toArray();

        // IMPORTANT: default allow if none of the generated permission codes exist in DB
        if (count($permissions) == 0) {
            return $result;
        }


        $permissionsCheck = $this->checkPermissionsPresence($permissions);

        $missedPermissions = [];

        foreach ($permissionsCheck as $permissionCode => $permissionExists) {
            if (!$permissionExists) {
                $missedPermissions[] = $permissionCode;
            }
        }

        if (count($missedPermissions) > 0) {
            $missedPermissions = SystemPermission::where('code', $missedPermissions)->get()->pluck('name')->toArray();

            $result['status'] = 'forbidden';
            $result['message'] = trans("You do not have next permissions:") . " " . implode(', ', $missedPermissions);

            return $result;
        }

        return $result;
    }

    public function checkPermissionsPresence($permissionCodes): array
    {
        $permissionsList = [];

        foreach ($permissionCodes as $permissionCode) {
            $permissionsList[$permissionCode] = 0;

            foreach ($this->roles as $role) {
                foreach ($role->permissions as $permission) {
                    if ($permission->code == $permissionCode) {
                        $permissionsList[$permissionCode] = 1;
                    }
                }
            }
        }

        return $permissionsList;
    }
}
