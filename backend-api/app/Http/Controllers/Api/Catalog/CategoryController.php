<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')->with('children')->get();

        return CategoryResource::collection($categories);
    }


   public function products(Request $request, $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $query = $category->products()
            ->with(['brand','images'])
            ->where('is_active', 1);

        // Brand filter
        if ($request->brand) {
            $query->whereHas('brand', function ($q) use ($request) {
                $q->where('slug', $request->brand);
            });
        }

        // Attribute filter
        if ($request->attribute && $request->value) {
            $query->whereHas('attributes', function ($q) use ($request) {
                $q->whereHas('attribute', function ($q2) use ($request) {
                    $q2->where('slug', $request->attribute);
                })->where('value', $request->value);
            });
        }

        $products = $query->paginate(20);

        return ProductListResource::collection($products);
    }
}
