<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserRole as UserRoleResource;
use App\Models\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as Validator;

class UserRoleController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = UserRole::query();

        [$perPage, $page, $fieldsToSelect, $searchStr, $from] = $this->buildParamsFromRequest($request, $query);

        $query->select($fieldsToSelect);

        $this->addSearchCriteria($searchStr, $query, ['']);

        $orderStr = $request->get('order','id:asc');

        $filters = $this->extractFilters($request,UserRole::class);

        $this->addFiltersCriteria($query,$filters,UserRole::class);

        [$totalRows, $items] = $this->addCountQueryAndExecute($orderStr, $query, $from, $perPage);

        $items->load(['role','user']);

        $response = [
            'items' => UserRoleResource::collection($items),
            'totalItems' => $totalRows,
            'totalPages' => ceil($totalRows/$perPage),
            'page' => $page,
            'perPage' => $perPage,
            'order' => $orderStr,
            'search' => $searchStr,
            'filters' => $filters,
        ];

        return $this->sendResponse($response,trans('User Roles retrieved successfully'));
    }



   /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $input = $request->all();

        $validator = Validator::make($input, UserRole::getRules());

        if($validator->fails()){
            return $this->sendError(trans('Validation Error'), $validator->errors(),400);
        }

        try{
            $item = UserRole::create($input);
        }catch(\Exception $e){
            return $this->sendError($e->getMessage(),[],409);
        }

        $item->load(['role','user']);

        return $this->sendResponse(new UserRoleResource($item),trans('User Role created successfully'));
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $item = UserRole::find($id);

        if(is_null($item)){
            return $this->sendError(trans('User Role not found'));
        }

        $item->load(['role','user']);

        return $this->sendResponse(new UserRoleResource($item),trans('User Role retrieved successfully'));

    }

     /**
     * Show the form for creating a new resource
     *
     * @param  \Illuminate\Http\Request  $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $input = $request->all();

        $item = new UserRole($input);

        $item->load(['role','user']);

        return $this->sendResponse(new UserRoleResource($item),null);
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
        $item = UserRole::find($id);

        if(is_null($item)){
            return $this->sendError(trans('User Role not found'));
        }

        $input = $request->all();

         $rules = UserRole::getRules($id);

        foreach ($rules as $k => $v) {
            if (!array_key_exists($k, $input)) {
                unset($rules[$k]);
            }
        }

        $validator = Validator::make($input,$rules);

        if($validator->fails()){
            return $this->sendError(trans('Validation Error'), $validator->errors(),400);
        }

        $item->fill($input);

        try{
            $item->save();
        }catch(\Exception $e){
            return $this->sendError($e->getMessage(),[],409);
        }

        $item->fresh();

        $item->load(['role','user']);

        return $this->sendResponse(new UserRoleResource($item), trans('User Role updated successfully'));

    }


    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $item = UserRole::find($id);

        if(is_null($item)){
            return $this->sendError(trans('User Role not found'));
        }

        try{
            $item->delete();
        }catch(\Exception $e){
            return $this->sendError($e->getMessage(),[],409);
        }

        return $this->sendResponse([], trans('User Role deleted successfully'));

    }
}
