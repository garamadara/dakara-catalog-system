<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function show(ProductImage $image)
    {
        $path = $image->getRawOriginal('image_url');

        abort_unless(Storage::disk('public')->exists($path), 404);

        return response()->file(Storage::disk('public')->path($path));
    }

    public function store(Request $request, Product $product)
    {
        $request->validate([
            'image' => 'required|image|max:4096'
        ]);

        $path = $request->file('image')->store('products', 'public');

        $image = $product->images()->create([
            'image_url' => $path,
            'sort_order' => 0
        ]);

        return response()->json($image);
    }

    public function destroy($id)
    {
        $image = ProductImage::findOrFail($id);

        Storage::disk('public')->delete($image->getRawOriginal('image_url'));

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
            ProductImage::where('id', $img['id'])
                ->where('product_id', $product->id)
                ->update(['sort_order' => $img['sort_order']]);
        }

        return response()->json([
            'success' => true
        ]);
    }
}
