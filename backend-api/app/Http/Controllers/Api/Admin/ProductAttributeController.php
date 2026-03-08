<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductAttribute;

class ProductAttributeController extends Controller
{
    public function store($productId)
    {
        $attributes = request()->input('attributes', []);

        foreach ($attributes as $attr) {

            ProductAttribute::updateOrCreate(
                [
                    'product_id' => $productId,
                    'attribute_id' => $attr['attribute_id']
                ],
                [
                    'value' => $attr['value']
                ]
            );

        }

        return response()->json([
            'message' => 'Attributes saved'
        ]);
    }

    public function index($productId)
    {
        return ProductAttribute::with('attribute')
            ->where('product_id', $productId)
            ->get();
    }
}