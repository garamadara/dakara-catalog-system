<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'part_number' => $this->part_number,
            'barcode' => $this->barcode,
            'description' => $this->public_description,
            'price' => $this->price,

            'brand' => $this->brand ? [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
            ] : null,

            'categories' => $this->categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ];
            }),

            'aliases' => $this->aliases->pluck('alias'),

            'attributes' => $this->attributes->map(function ($attr) {
                return [
                    'name' => optional($attr->attribute)->name,
                    'value' => $attr->value
                ];
            }),

            'images' => $this->images->map(function ($image) {
                return [
                    'url' => $image->image_url,
                    'primary' => $image->sort_order === 1
                ];
            }),

            'cross_references' => $this->crossReferences->map(function ($ref) {
                return [
                    'brand' => $ref->brand,
                    'part_number' => $ref->part_number
                ];
            }),
        ];
    }
}
