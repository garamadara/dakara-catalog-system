<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;

class ProductController extends Controller
{
   public function index(Request $request)
    {
        $perPage = min((int) $request->get('per_page', 20), 100);

        $query = Product::query()
            ->with(['brand','thumbnail'])
            ->where('is_active', 1);

        /*
        |--------------------------------
        | Search
        |--------------------------------
        */

        if ($request->filled('search')) {

            $search = $request->search;

            $normalized = Product::normalizePartNumber($search);

            $query->where(function ($q) use ($search, $normalized) {

                $q->where('products.name', 'LIKE', "%{$search}%")

                  ->orWhere('products.part_number', 'LIKE', "%{$search}%")

                  ->orWhere('products.normalized_part_number', 'LIKE', "%{$normalized}%")

                  ->orWhereHas('aliases', function ($aliasQuery) use ($normalized) {
                      $aliasQuery->where('normalized_alias', 'LIKE', "%{$normalized}%");
                  })

                  ->orWhereHas('crossReferences', function ($refQuery) use ($normalized) {
                      $refQuery->where('normalized_part_number', 'LIKE', "%{$normalized}%");
                  });

            });
        }

        /*
        |--------------------------------
        | Brand filter
        |--------------------------------
        */

        if ($request->filled('brand')) {
            $query->whereHas('brand', function ($q) use ($request) {
                $q->where('slug', $request->brand);
            });
        }

        /*
        |--------------------------------
        | Ordering
        |--------------------------------
        */

        $query->orderBy('id', 'desc');

        $products = $query->paginate($perPage)->withQueryString();

        return ProductListResource::collection($products);
    }

        public function show($slug)
        {
            $product = Product::with([
                'brand',
                'images',
                'categories',
                'aliases',
                'attributes.attribute',
                'crossReferences'
            ])->where('slug', $slug)->firstOrFail();

            return new ProductResource($product);
        }
    }