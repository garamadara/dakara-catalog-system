<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProductCategoryController extends Controller
{
    public function attach(Request $request, Product $product)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id'
        ]);

        $product->categories()->syncWithoutDetaching([$data['category_id']]);

        return response()->json([
            'success' => true
        ]);
    }

    public function detach(Product $product, Category $category)
    {
        $product->categories()->detach($category->id);

        return response()->json([
            'success' => true
        ]);
    }
}