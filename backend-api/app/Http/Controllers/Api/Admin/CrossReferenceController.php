<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use App\Models\CrossReference;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CrossReferenceController extends Controller
{
    public function index($productId)
    {
        $product = Product::findOrFail($productId);

        return response()->json(
            $product->crossReferences()->orderBy('brand')->get()
        );
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'brand' => 'required|string|max:100',
            'part_number' => 'required|string|max:100'
        ]);

        $product = Product::findOrFail($productId);

        $normalized = Product::normalizePartNumber($request->part_number);

        $ref = CrossReference::create([
            'product_id' => $product->id,
            'brand' => $request->brand,
            'part_number' => $request->part_number,
            'normalized_part_number' => $normalized
        ]);

        return response()->json($ref);
    }

    public function destroy($id)
    {
        $ref = CrossReference::findOrFail($id);

        $ref->delete();

        return response()->json([
            'success' => true
        ]);
    }
}