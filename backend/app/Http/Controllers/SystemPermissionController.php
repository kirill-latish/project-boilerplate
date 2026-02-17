<?php

namespace App\Http\Controllers;

use App\Http\Resources\SystemPermission as SystemPermissionResource;
use App\Models\SystemPermission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as Validator;

class SystemPermissionController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = SystemPermission::query();

        [$perPage, $page, $fieldsToSelect, $searchStr, $from] = $this->buildParamsFromRequest($request, $query);

        $query->select($fieldsToSelect);

        $this->addSearchCriteria($searchStr, $query, ['code', 'name']);

        $orderStr = $request->get('order', 'id:asc');

        $filters = $this->extractFilters($request, SystemPermission::class);

        $this->addFiltersCriteria($query, $filters, SystemPermission::class);

        [$totalRows, $items] = $this->addCountQueryAndExecute($orderStr, $query, $from, $perPage);

        $response = [
            'items' => SystemPermissionResource::collection($items),
            'totalItems' => $totalRows,
            'totalPages' => ceil($totalRows / $perPage),
            'page' => $page,
            'perPage' => $perPage,
            'order' => $orderStr,
            'search' => $searchStr,
            'filters' => $filters,
        ];

        return $this->sendResponse($response, trans('System Permissions retrieved successfully'));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        return $this->sendError(trans("Creation of new System Permission is prohibited"), [], 409);

        $input = $request->all();

        $validator = Validator::make($input, SystemPermission::getRules());

        if ($validator->fails()) {
            return $this->sendError(trans('Validation Error'), $validator->errors(), 400);
        }

        try {
            $item = SystemPermission::create($input);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 409);
        }

        return $this->sendResponse(
            new SystemPermissionResource($item),
            trans('System Permission created successfully')
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
        $item = SystemPermission::find($id);

        if (is_null($item)) {
            return $this->sendError(trans('System Permission not found'));
        }

        return $this->sendResponse(
            new SystemPermissionResource($item),
            trans('System Permission retrieved successfully')
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

        $item = new SystemPermission($input);

        return $this->sendResponse(new SystemPermissionResource($item), null);
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
        return $this->sendError(trans("Editing of System Permission is prohibited"), [], 409);

        $item = SystemPermission::find($id);

        if (is_null($item)) {
            return $this->sendError(trans('System Permission not found'));
        }

        $input = $request->all();

        $rules = SystemPermission::getRules($id);

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

        return $this->sendResponse(
            new SystemPermissionResource($item),
            trans('System Permission updated successfully')
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

        return $this->sendError(trans("Deletion of System Permission is prohibited"), [], 409);

        $item = SystemPermission::find($id);

        if (is_null($item)) {
            return $this->sendError(trans('System Permission not found'));
        }

        try {
            $item->delete();
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 409);
        }

        return $this->sendResponse([], trans('System Permission deleted successfully'));
    }
}
