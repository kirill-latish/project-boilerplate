<?php

namespace App\Http\Controllers;

use App\Http\Resources\PricingPlan as PricingPlanResource;
use App\Models\PricingPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator as Validator;

class PricingPlanController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = PricingPlan::query();

        [$perPage, $page, $fieldsToSelect, $searchStr, $from] = $this->buildParamsFromRequest($request, $query);

        $query->select($fieldsToSelect);

        $this->addSearchCriteria($searchStr, $query, ['name','slug','description','monthly_price','yearly_price','currency','features','cta_label','cta_href','cta_variant','highlighted','sort_order','is_active']);

        $orderStr = $request->get('order','id:asc');

        $filters = $this->extractFilters($request,PricingPlan::class);

        $this->addFiltersCriteria($query,$filters,PricingPlan::class);

        [$totalRows, $items] = $this->addCountQueryAndExecute($orderStr, $query, $from, $perPage);

        $response = [
            'items' => PricingPlanResource::collection($items),
            'totalItems' => $totalRows,
            'totalPages' => ceil($totalRows/$perPage),
            'page' => $page,
            'perPage' => $perPage,
            'order' => $orderStr,
            'search' => $searchStr,
            'filters' => $filters,
        ];

        return $this->sendResponse($response,trans('Pricing Plans retrieved successfully'));
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

        $validator = Validator::make($input, PricingPlan::getRules());

        if($validator->fails()){
            return $this->sendError(trans('Validation Error'), $validator->errors(),400);
        }

        try{
            $item = PricingPlan::create($input);
        }catch(\Exception $e){
            return $this->sendError($e->getMessage(),[],409);
        }

        return $this->sendResponse(new PricingPlanResource($item),trans('Pricing Plan created successfully'));
    }

    /**
     * Display the specified resource.
     *
     * @param $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        $item = PricingPlan::find($id);

        if(is_null($item)){
            return $this->sendError(trans('Pricing Plan not found'));
        }

        return $this->sendResponse(new PricingPlanResource($item),trans('Pricing Plan retrieved successfully'));

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

        $item = new PricingPlan($input);

        return $this->sendResponse(new PricingPlanResource($item),null);
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
        $item = PricingPlan::find($id);

        if(is_null($item)){
            return $this->sendError(trans('Pricing Plan not found'));
        }

        $input = $request->all();

         $rules = PricingPlan::getRules($id);

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

        return $this->sendResponse(new PricingPlanResource($item), trans('Pricing Plan updated successfully'));

    }


    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $item = PricingPlan::find($id);

        if(is_null($item)){
            return $this->sendError(trans('Pricing Plan not found'));
        }

        try{
            $item->delete();
        }catch(\Exception $e){
            return $this->sendError($e->getMessage(),[],409);
        }

        return $this->sendResponse([], trans('Pricing Plan deleted successfully'));

    }
}
