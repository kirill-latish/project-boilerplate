<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserRole extends JsonResource
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
        
        // Include role if loaded
        if ($this->relationLoaded('role')) {
            $data['role'] = $this->whenLoaded('role');
        }
        
        // Include user if loaded
        if ($this->relationLoaded('user')) {
            $data['user'] = $this->whenLoaded('user');
        }
        
        return $data;
    }
}

