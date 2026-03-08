<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use App\Models\ProductAlias;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Product as ModelsProduct;

class ProductAliasController extends Controller
{
    public function index($productId)
    {
        $product = Product::findOrFail($productId);

        return response()->json(
            $product->aliases()->orderBy('alias')->get()
        );
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'alias' => 'required|string|max:100'
        ]);

        $product = Product::findOrFail($productId);

        $alias = ProductAlias::create([
            'product_id' => $product->id,
            'alias' => $request->alias,
            'normalized_alias' => ModelsProduct::normalizePartNumber($request->alias)
        ]);

        return response()->json($alias);
    }

    public function destroy($id)
    {
        $alias = ProductAlias::findOrFail($id);

        $alias->delete();

        return response()->json([
            'success' => true
        ]);
    }
}