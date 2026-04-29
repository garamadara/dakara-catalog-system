<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function index(Product $product)
    {
        return response()->json($product->variants()->get());
    }

    public function store(Request $request, Product $product)
    {
        $replace = filter_var($request->input('replace', false), FILTER_VALIDATE_BOOLEAN);

        $data = $request->validate([
            'variants' => 'sometimes|array',
            'generated_variants' => 'sometimes|array',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.part_number' => 'nullable|string|max:255',
            'variants.*.cost_price' => 'nullable|numeric|min:0',
            'variants.*.selling_price' => 'nullable|numeric|min:0',
            'variants.*.promo_price' => 'nullable|numeric|min:0',
            'variants.*.stock' => 'nullable|integer|min:0',
        ]);

        $normalizedVariants = $this->normalizeVariants(
            $this->extractRawVariants($request, $data)
        );

        if (empty($normalizedVariants)) {
            return response()->json([
                'message' => 'No valid variants in payload.',
            ], 422);
        }

        if ($replace) {
            $product->variants()->delete();
        }

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

        return response()->json($product->variants()->get());
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

    private function extractRawVariants(Request $request, array $validated): array
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
            $value = $validated[$key] ?? $request->input($key);
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
