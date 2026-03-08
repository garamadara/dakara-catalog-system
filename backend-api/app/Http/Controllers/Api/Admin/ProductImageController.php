<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    /**
     * Upload image to storage
     */
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:4096'
        ]);

        $path = $request->file('image')->store('products', 'public');

        return response()->json([
            'url' => asset('storage/' . $path),
            'path' => $path
        ]);
    }

    /**
     * Attach image to product
     */
    public function store(Request $request, $productId)
    {
        $request->validate([
            'path' => 'required|string'
        ]);

        $product = Product::findOrFail($productId);

        $image = ProductImage::create([
            'product_id' => $product->id,
            'image_path' => $request->path,
            'sort_order' => $request->sort_order ?? 1
        ]);

        return response()->json($image);
    }

    /**
     * Delete product image
     */
    public function destroy($id)
    {
        $image = ProductImage::findOrFail($id);

        Storage::disk('public')->delete($image->image_path);

        $image->delete();

        return response()->json([
            'success' => true
        ]);
    }

    public function reorder(Request $request, Product $product)
    {
        $data = $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:product_images,id',
            'images.*.sort_order' => 'required|integer'
        ]);

        foreach ($data['images'] as $img) {
            \App\Models\ProductImage::where('id', $img['id'])
                ->where('product_id', $product->id)
                ->update(['sort_order' => $img['sort_order']]);
        }

        return response()->json([
            'success' => true
        ]);
    }
}