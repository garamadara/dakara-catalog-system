<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\UniqueConstraintViolationException;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with([
            'brand',
            'categories',
            'thumbnail',
            'variants',
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
                    : null,

                'variants' => $p->variants,
                'variant_count' => $p->variants->count(),
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

            'variants' => 'sometimes|array',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.part_number' => 'nullable|string|max:255',
            'variants.*.cost_price' => 'nullable|numeric|min:0',
            'variants.*.selling_price' => 'nullable|numeric|min:0',
            'variants.*.promo_price' => 'nullable|numeric|min:0',
            'variants.*.stock' => 'nullable|integer|min:0',
        ]);

        // Normalize part number
        if (!empty($data['part_number'])) {
            $data['normalized_part_number'] =
                Product::normalizePartNumber($data['part_number']);
        }

        // Ensure selling price default
        $data['selling_price'] = $data['selling_price'] ?? 0;

        $normalizedVariants = $this->normalizeVariants(
            $this->extractRawVariants($request)
        );

        $baseSlug = Str::slug($data['name']);
        $product = null;

        for ($attempt = 0; $attempt < 3; $attempt++) {
            $payload = $data;
            $payload['slug'] = $this->nextAvailableSlug($baseSlug);

            try {
                $product = DB::transaction(function () use ($payload, $normalizedVariants) {
                    $product = Product::create($payload);

                    $product->categories()->sync([$payload['category_id']]);

                    if (!empty($normalizedVariants)) {
                        foreach ($normalizedVariants as $variant) {
                            $product->variants()->create([
                                'sku' => $variant['sku'],
                                'part_number' => $variant['part_number'],
                                'cost_price' => $variant['cost_price'],
                                'selling_price' => $variant['selling_price'],
                                'promo_price' => $variant['promo_price'],
                                'stock' => $variant['stock'],
                            ]);
                        }
                    }

                    return $product;
                });

                break;
            } catch (UniqueConstraintViolationException $e) {
                if ($attempt === 2) {
                    throw $e;
                }
            }
        }

        return response()->json($product->load(['categories', 'variants']));
    }


    public function edit(Product $product)
    {
        $product->load([
            'brand',
            'categories',
            'variants',
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

    private function nextAvailableSlug(string $baseSlug): string
    {
        $usedSlugs = Product::where('slug', $baseSlug)
            ->orWhere('slug', 'like', $baseSlug . '-%')
            ->pluck('slug');

        if (!$usedSlugs->contains($baseSlug)) {
            return $baseSlug;
        }

        $maxSuffix = 0;

        foreach ($usedSlugs as $slug) {
            if (preg_match('/^' . preg_quote($baseSlug, '/') . '-(\d+)$/', $slug, $matches)) {
                $maxSuffix = max($maxSuffix, (int) $matches[1]);
            }
        }

        return $baseSlug . '-' . ($maxSuffix + 1);
    }

    private function normalizeVariants(array $variants): array
    {
        return collect($variants)
            ->filter(fn ($variant) => is_array($variant))
            ->map(function (array $variant) {
                return [
                    'sku' => $variant['sku'] ?? $variant['code'] ?? null,
                    'part_number' => $variant['part_number']
                        ?? $variant['partNumber']
                        ?? $variant['variant']
                        ?? $variant['name']
                        ?? null,
                    'cost_price' => isset($variant['cost_price'])
                        ? (float) $variant['cost_price']
                        : (isset($variant['costPrice']) ? (float) $variant['costPrice'] : 0),
                    'selling_price' => isset($variant['selling_price'])
                        ? (float) $variant['selling_price']
                        : (isset($variant['sellingPrice'])
                            ? (float) $variant['sellingPrice']
                            : (isset($variant['price']) ? (float) $variant['price'] : 0)),
                    'promo_price' => isset($variant['promo_price'])
                        ? (float) $variant['promo_price']
                        : (isset($variant['promoPrice']) ? (float) $variant['promoPrice'] : 0),
                    'stock' => isset($variant['stock'])
                        ? (int) $variant['stock']
                        : (isset($variant['quantity']) ? (int) $variant['quantity'] : 0),
                ];
            })
            ->values()
            ->all();
    }

    private function extractRawVariants(Request $request): array
    {
        $candidateKeys = [
            'variants',
            'generatedVariants',
            'generated_variants',
            'variantRows',
            'variant_rows',
            'variantCombinations',
            'variant_combinations',
            'combinations',
            'productVariants',
            'product_variants',
        ];

        foreach ($candidateKeys as $key) {
            $value = $request->input($key);
            if (is_array($value) && !empty($value)) {
                return $value;
            }
        }

        foreach ($request->all() as $value) {
            if (!is_array($value) || empty($value)) {
                continue;
            }

            $first = reset($value);
            if (!is_array($first)) {
                continue;
            }

            if (
                array_key_exists('sku', $first)
                || array_key_exists('code', $first)
                || array_key_exists('partNumber', $first)
                || array_key_exists('part_number', $first)
                || array_key_exists('variant', $first)
                || array_key_exists('name', $first)
                || array_key_exists('costPrice', $first)
                || array_key_exists('price', $first)
                || array_key_exists('sellingPrice', $first)
                || array_key_exists('selling_price', $first)
                || array_key_exists('promoPrice', $first)
                || array_key_exists('stock', $first)
                || array_key_exists('quantity', $first)
            ) {
                return $value;
            }
        }

        return [];
    }
}
