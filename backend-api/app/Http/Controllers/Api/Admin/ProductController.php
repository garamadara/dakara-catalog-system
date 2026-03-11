<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with([
            'brand',
            'categories',
            'thumbnail'
        ])->latest();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('part_number', 'like', "%{$request->search}%");
            });
        }

        $products = $query->paginate(20);

        $products->getCollection()->transform(function ($p) {

            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'part_number' => $p->part_number,

                'brand' => $p->brand,

                'categories' => $p->categories,

                'selling_price' => $p->selling_price,

                'status' => $p->status ?? 'draft',

                'thumbnail' => $p->thumbnail
                    ? [
                        'image_url' => $p->thumbnail->image_url
                    ]
                    : null
            ];
        });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',

            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',

            'part_number' => 'nullable|string|max:255',

            'cost_price' => 'nullable|numeric|min:0',
            'selling_price' => 'required|numeric|min:0',
            'promo_price' => 'nullable|numeric|min:0',

            'promo_start' => 'nullable|date',
            'promo_end' => 'nullable|date',
        ]);

        // Normalize part number
        if (!empty($data['part_number'])) {
            $data['normalized_part_number'] =
                Product::normalizePartNumber($data['part_number']);
        }

        // Generate slug from NAME only
        $slug = Str::slug($data['name']);

        $originalSlug = $slug;
        $counter = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        $data['slug'] = $slug;

        // Ensure selling price default
        $data['selling_price'] = $data['selling_price'] ?? 0;

        $product = Product::create($data);

        return response()->json($product);
    }


    public function edit(Product $product)
    {
        $product->load([
            'brand',
            'categories',
            'imageimages',
            'aliases',
            'crossReferences',
            'attributes.attribute'
        ]);

        $brands = \App\Models\Brand::orderBy('name')->get();
        $categories = \App\Models\Category::orderBy('name')->get();
        $attributes = \App\Models\Attribute::orderBy('name')->get();

        return response()->json([
            'product' => $product,
            'brands' => $brands,
            'categories' => $categories,
            'attributes' => $attributes
        ]);
    }


    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',

            'category_id' => 'sometimes|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',

            'part_number' => 'nullable|string|max:255',

            'cost_price' => 'nullable|numeric|min:0',
            'selling_price' => 'sometimes|numeric|min:0',
            'promo_price' => 'nullable|numeric|min:0',

            'promo_start' => 'nullable|date',
            'promo_end' => 'nullable|date',
        ]);

        // Recalculate normalized part number
        if (array_key_exists('part_number', $data)) {

            if ($data['part_number']) {
                $data['normalized_part_number'] =
                    Product::normalizePartNumber($data['part_number']);
            } else {
                $data['normalized_part_number'] = null;
            }
        }

        // Regenerate slug if name changes
        if (array_key_exists('name', $data)) {

            $slug = Str::slug($data['name']);

            $originalSlug = $slug;
            $counter = 1;

            while (
                Product::where('slug', $slug)
                    ->where('id', '!=', $product->id)
                    ->exists()
            ) {
                $slug = $originalSlug . '-' . $counter;
                $counter++;
            }

            $data['slug'] = $slug;
        }

        $product->update($data);

        return response()->json($product);
    }


    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'success' => true
        ]);
    }
}