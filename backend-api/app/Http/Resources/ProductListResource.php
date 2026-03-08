<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
{
    public function toArray($request)
    {
        return [

            'id' => $this->id,

            'name' => $this->name,

            'slug' => $this->slug,

            'part_number' => $this->part_number,

            'brand' => [
                'id' => $this->brand->id ?? null,
                'name' => $this->brand->name ?? null,
                'slug' => $this->brand->slug ?? null,
            ],

            'image' => $this->images
                ->sortBy('sort_order')
                ->first()?->image_url,

        ];
    }
}