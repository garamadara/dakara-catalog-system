<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use App\Helpers\SearchHelper;

class ProductController extends Controller
{

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'part_number' => 'required|string|max:255',
            'brand_id' => 'required|exists:brands,id',

            'cost_price' => 'nullable|numeric',
            'selling_price' => 'nullable|numeric',
            'promo_price' => 'nullable|numeric',

            'promo_start' => 'nullable|date',
            'promo_end' => 'nullable|date',
        ]);

        $data['normalized_part_number'] = normalizePartNumber($data['part_number']);
        $data['slug'] = generateProductSlug($data['name'], $data['part_number']);

        $product = Product::create($data);

        return response()->json($product);
    }

    public function edit(Product $product)
    {
        $product->load([
            'brand',
            'categories',
            'images',
            'aliases',
            'crossReferences',
            'attributes.attribute'
        ]);

        $brands = \App\Models\Brand::orderBy('name')->get();
        $categories = \App\Models\Category::orderBy('name')->get();
        $attributes = \App\Models\Attribute::orderBy('name')->get();

        return response()->json([
            'product' => $product,
            'brands' => $brands,
            'categories' => $categories,
            'attributes' => $attributes
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'part_number' => 'sometimes|string|max:255',
            'brand_id' => 'sometimes|exists:brands,id',

            'cost_price' => 'nullable|numeric',
            'selling_price' => 'nullable|numeric',
            'promo_price' => 'nullable|numeric',

            'promo_start' => 'nullable|date',
            'promo_end' => 'nullable|date',
        ]);

        if (isset($data['part_number'])) {
            $data['normalized_part_number'] = normalizePartNumber($data['part_number']);
        }

        $product->update($data);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'success' => true
        ]);
    }

}