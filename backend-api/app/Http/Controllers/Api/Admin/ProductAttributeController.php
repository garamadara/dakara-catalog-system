<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductAttribute;
use Illuminate\Http\Request;

class ProductAttributeController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $data = $request->validate([
            'attributes' => 'required|array',
            'attributes.*.attribute_id' => 'required|integer',
            'attributes.*.value' => 'required'
        ]);

        foreach ($data['attributes'] as $attr) {

            $value = $attr['value'];

            // handle multi-value attributes
            if (is_array($value)) {

                foreach ($value as $v) {

                    ProductAttribute::create([
                        'product_id' => $product->id,
                        'attribute_id' => $attr['attribute_id'],
                        'value' => $v
                    ]);

                }

            } else {

                ProductAttribute::create([
                    'product_id' => $product->id,
                    'attribute_id' => $attr['attribute_id'],
                    'value' => $value
                ]);

            }

        }

        return response()->json([
            'success' => true
        ]);
    }

    public function index(Product $product)
    {
        return ProductAttribute::with('attribute')
            ->where('product_id', $product->id)
            ->get();
    }
}
