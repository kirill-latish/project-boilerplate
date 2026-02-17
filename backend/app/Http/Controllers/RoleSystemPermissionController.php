<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleSystemPermission as RoleSystemPermissionResource;
use App\Models\RoleSystemPermission;
use App\Models\SystemPermission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as Validator;

class RoleSystemPermissionController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = RoleSystemPermission::query();

        [$perPage, $page, $fieldsToSelect, $searchStr, $from] = $this->buildParamsFromRequest($request, $query);

        $query->select($fieldsToSelect);

        $this->addSearchCriteria($searchStr, $query, ['']);

        $orderStr = $request->get('order', 'id:asc');

        $filters = $this->extractFilters($request, RoleSystemPermission::class);

        $this->addFiltersCriteria($query, $filters, RoleSystemPermission::class);

        [$totalRows, $items] = $this->addCountQueryAndExecute($orderStr, $query, $from, $perPage);

        $items->load(['role', 'systemPermission']);

        $response = [
            'items' => RoleSystemPermissionResource::collection($items),
            'totalItems' => $totalRows,
            'totalPages' => ceil($totalRows / $perPage),
            'page' => $page,
            'perPage' => $perPage,
            'order' => $orderStr,
            'search' => $searchStr,
            'filters' => $filters,
        ];

        return $this->sendResponse($response, trans('Role System Permissions retrieved successfully'));
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

        $validator = Validator::make($input, RoleSystemPermission::getRules());

        if ($validator->fails()) {
            return $this->sendError(trans('Validation Error'), $validator->errors(), 400);
        }

        $systemPermissionId = $input['system_permission_id'];

        $systemPermission = SystemPermission::find($systemPermissionId);

        if($systemPermission->code == 'RoleSystemPermission_edit'){
            return $this->sendError(trans('Assigning of this permission is prohibited'), [], 409);
        }

        try {
            $item = RoleSystemPermission::create($input);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 409);
        }

        $item->load(['role', 'systemPermission']);

        return $this->sendResponse(
            new RoleSystemPermissionResource($item),
            trans('Added permission :permission to Role :role',['permission'=>$item->systemPermission->name, 'role'=>$item->role->name])
        );
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $item = RoleSystemPermission::find($id);

        if (is_null($item)) {
            return $this->sendError(trans('Role System Permission not found'));
        }

        $item->load(['role', 'systemPermission']);

        return $this->sendResponse(
            new RoleSystemPermissionResource($item),
            trans('Role System Permission retrieved successfully')
        );
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

        $item = new RoleSystemPermission($input);

        $item->load(['role', 'systemPermission']);

        return $this->sendResponse(new RoleSystemPermissionResource($item), null);
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
        $item = RoleSystemPermission::find($id);

        if (is_null($item)) {
            return $this->sendError(trans('Role System Permission not found'));
        }

        $input = $request->all();

        $rules = RoleSystemPermission::getRules($id);

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

        $item->load(['role', 'systemPermission']);

        return $this->sendResponse(
            new RoleSystemPermissionResource($item),
            trans('Role System Permission updated successfully')
        );
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $item = RoleSystemPermission::find($id);

        if (is_null($item)) {
            return $this->sendError(trans('Role System Permission not found'));
        }

        try {

            $roleName = $item->role->name;
            $permissionName = $item->systemPermission->name;

            $item->delete();
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 409);
        }

        return $this->sendResponse([], trans('Removed permission :permission from Role :role',['permission'=>$permissionName, 'role'=>$roleName]));
    }
}
