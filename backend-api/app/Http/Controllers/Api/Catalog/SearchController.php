<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductListResource;
use App\Helpers\SearchHelper;


class SearchController extends Controller
{
    public function search(Request $request)
    {
        $q = trim($request->q);

        if (!$q) {
            return response()->json([]);
        }

        $normalized = SearchHelper::normalizePartNumber($q);

        $products = Product::query()

            ->where('products.is_active', 1)

            ->where(function ($query) use ($q, $normalized) {

                $query->where('products.normalized_part_number', $normalized)

                    ->orWhere('products.normalized_part_number', 'like', "%{$normalized}%")

                    ->orWhere('products.name', 'like', "%{$q}%")

                    ->orWhereExists(function ($aliasQuery) use ($normalized) {

                        $aliasQuery->selectRaw(1)
                            ->from('product_aliases')
                            ->whereColumn('product_aliases.product_id', 'products.id')
                            ->where('product_aliases.normalized_alias', 'like', "%{$normalized}%");

                    })

                    ->orWhereExists(function ($refQuery) use ($normalized) {

                        $refQuery->selectRaw(1)
                            ->from('cross_references')
                            ->whereColumn('cross_references.product_id', 'products.id')
                            ->where('cross_references.normalized_part_number', 'like', "%{$normalized}%");

                    });

            })

            ->orderByRaw("
                CASE
                    WHEN products.normalized_part_number = ? THEN 1
                    WHEN products.normalized_part_number LIKE ? THEN 2
                    ELSE 3
                END
            ", [
                $normalized,
                "{$normalized}%"
            ])

            ->limit(50)

            ->get();


        return ProductListResource::collection($products);
    }

    public function suggest(Request $request)
    {
        $q = trim($request->q);

        if (!$q) {
            return response()->json([]);
        }

        $normalized = SearchHelper::normalizePartNumber($q);

        $products = Product::query()

            ->where(function ($query) use ($q, $normalized) {

                $query->where('normalized_part_number', 'like', "{$normalized}%")
                      ->orWhere('name', 'like', "{$q}%");

            })

            ->select([
                'id',
                'name',
                'part_number',
                'slug'
            ])

            ->limit(5)

            ->get();

        $aliasMatches = Product::query()

            ->join('product_aliases', 'products.id', '=', 'product_aliases.product_id')

            ->where('product_aliases.normalized_alias', 'like', "{$normalized}%")

            ->select([
                'products.id',
                'products.name',
                'products.part_number',
                'products.slug'
            ])

            ->limit(5)

            ->get();

        $crossMatches = Product::query()

            ->join('cross_references', 'products.id', '=', 'cross_references.product_id')

            ->where('cross_references.normalized_part_number', 'like', "{$normalized}%")

            ->select([
                'products.id',
                'products.name',
                'products.part_number',
                'products.slug'
            ])

            ->limit(5)

            ->get();

        $results = $products
            ->merge($aliasMatches)
            ->merge($crossMatches)
            ->unique('id')
            ->values()
            ->take(10);

        return response()->json($results);
    }
}