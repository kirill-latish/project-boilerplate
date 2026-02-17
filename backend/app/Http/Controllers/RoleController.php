<?php

namespace App\Http\Controllers;

use App\Http\Resources\Role as RoleResource;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as Validator;

class RoleController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Role::query();

        [$perPage, $page, $fieldsToSelect, $searchStr, $from] = $this->buildParamsFromRequest($request, $query);

        $query->select($fieldsToSelect);

        $this->addSearchCriteria($searchStr, $query, ['code', 'name']);

        $orderStr = $request->get('order', 'id:asc');

        $filters = $this->extractFilters($request, Role::class);

        $this->addFiltersCriteria($query, $filters, Role::class);

        [$totalRows, $items] = $this->addCountQueryAndExecute($orderStr, $query, $from, $perPage);

        $response = [
            'items' => RoleResource::collection($items),
            'totalItems' => $totalRows,
            'totalPages' => ceil($totalRows / $perPage),
            'page' => $page,
            'perPage' => $perPage,
            'order' => $orderStr,
            'search' => $searchStr,
            'filters' => $filters,
        ];

        return $this->sendResponse($response, trans('Roles retrieved successfully'));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $input = $request->all();

        $validator = Validator::make($input, Role::getRules());

        if ($validator->fails()) {
            return $this->sendError(trans('Validation Error'), $validator->errors(), 400);
        }

        try {
            $item = Role::create($input);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 409);
        }

        return $this->sendResponse(new RoleResource($item), trans('Role created successfully'));
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $item = Role::with('permissions')->find($id);

        if (is_null($item)) {
            return $this->sendError(trans('Role not found'));
        }

        return $this->sendResponse(new RoleResource($item), trans('Role retrieved successfully'));
    }

    /**
     * Show the form for creating a new resource
     *
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $input = $request->all();

        $item = new Role($input);

        return $this->sendResponse(new RoleResource($item), null);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $item = Role::find($id);

        if (is_null($item)) {
            return $this->sendError(trans('Role not found'));
        }

        $input = $request->all();

        $rules = Role::getRules($id);

        foreach ($rules as $k => $v) {
            if (!array_key_exists($k, $input)) {
                unset($rules[$k]);
            }
        }

        $validator = Validator::make($input, $rules);

        if ($validator->fails()) {
            return $this->sendError(trans('Validation Error'), $validator->errors(), 400);
        }

        $item->fill($input);

        try {
            $item->save();
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 409);
        }

        $item->fresh();

        return $this->sendResponse(new RoleResource($item), trans('Role updated successfully'));
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $item = Role::find($id);

        if (is_null($item)) {
            return $this->sendError(trans('Role not found'));
        }

        try {
            $item->delete();
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 409);
        }

        return $this->sendResponse([], trans('Role deleted successfully'));
    }

    /**
     * Sync permissions for a role.
     *
     * @param Request $request
     * @param $id
     * @return JsonResponse
     */
    public function syncPermissions(Request $request, $id)
    {
        $role = Role::find($id);

        if (is_null($role)) {
            return $this->sendError(trans('Role not found'));
        }

        $input = $request->all();
        $permissionIds = $input['permission_ids'] ?? [];

        if (!is_array($permissionIds)) {
            return $this->sendError(trans('permission_ids must be an array'), [], 400);
        }

        try {
            $role->permissions()->sync($permissionIds);
            $role->load('permissions');
            $role->refresh();
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 409);
        }

        return $this->sendResponse(
            new RoleResource($role),
            trans('Role permissions synced successfully')
        );
    }
}
