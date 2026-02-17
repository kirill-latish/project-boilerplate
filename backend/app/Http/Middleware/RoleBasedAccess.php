<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;

class RoleBasedAccess
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse) $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        /** @var User $user */
        $user = auth()->user();

        $action = $request->route()->getAction();
        $requestMethod = $request->method();

        $routeParameters = $request->route()->parameters();

        list($controller, $method) = explode('@', $action['controller']);

        $controller = substr($controller, strrpos($controller, '\\') + 1);

        $model = str_replace('Controller', '', $controller);

        if (!$user) return response()->json([
            'status' => 'access_denied',
            'message' => 'Unauthorized'
        ], 403);

        if (!in_array($user->state, [User::STATE_ACTIVE])) return response()->json([
            'status' => 'access_denied',
            'message' => 'User is inactive'
        ], 403);

        // check if request is from ajaxSelect and this is GET request and referrer is = env(FRONT_LINK) and request has ajaxSelect header and this header is matched with env('AJAX_SELECT_SECRET')- skip permission check
        if ($request->hasHeader('Ajax-Select') && $request->header('Ajax-Select') == env('AJAX_SELECT_SECRET') && $requestMethod == 'GET' && str_contains($request->header('Referer'), env('FRONT_LINK'))) {
            return $next($request);
        }

        // Get request parameters, excluding file uploads for permission checks
        $requestParams = $request->all();
        // Remove file uploads from permission check (they're handled separately)
        if ($request->hasFile('attachments')) {
            unset($requestParams['attachments']);
        }

        $permissionCheckResult = $user->checkPermission($method, $model, $requestMethod, $requestParams);

        if ($permissionCheckResult['status'] == 'forbidden') {
            return response()->json([
                'status' => 'access_denied',
                'message' => $permissionCheckResult['message']
            ], 403);
        }

        return $next($request);
    }
}
