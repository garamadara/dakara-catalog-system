<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductCrossReferenceController extends Controller
{
    public function store($productId)
    {
        $refs = request()->input('references', []);

        foreach ($refs as $refId) {

            ProductCrossReference::updateOrCreate(
                [
                    'product_id' => $productId,
                    'reference_product_id' => $refId
                ]
            );

        }

        return response()->json([
            'message' => 'Cross references saved'
        ]);
    }

    public function index($productId)
    {
        return ProductCrossReference::with('reference')
            ->where('product_id',$productId)
            ->get();
    }
}