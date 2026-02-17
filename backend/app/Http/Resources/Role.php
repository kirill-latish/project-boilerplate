<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Role extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray(Request $request)
    {
        $data = parent::toArray($request);
        
        // Include permissions if loaded
        if ($this->relationLoaded('permissions')) {
            $data['permissions'] = $this->whenLoaded('permissions');
        }
        
        return $data;
    }
}
