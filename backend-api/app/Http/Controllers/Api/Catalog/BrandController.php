<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Models\Brand;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\BrandResource;

class BrandController extends Controller
{
    public function index()
    {
        return BrandResource::collection(
            Brand::orderBy('name')->get()
        );
    }

    public function products(Request $request, $slug)
    {
        $brand = Brand::where('slug', $slug)->firstOrFail();

        $products = $brand->products()
            ->with(['brand','images'])
            ->where('is_active', 1)
            ->paginate(20);

        return ProductListResource::collection($products);
    }
}