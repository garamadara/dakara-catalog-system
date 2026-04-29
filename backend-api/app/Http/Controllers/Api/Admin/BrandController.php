<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    public function index()
    {
        return Brand::select(
            'id',
            'name',
            'slug',
            'logo_url'
        )
        ->orderBy('name')
        ->get()
        ->map(function (Brand $brand) {
            if ($brand->getRawOriginal('logo_url')) {
                $brand->logo_url = url('/api/admin/brands/' . $brand->id . '/logo');
            }
            return $brand;
        });
    }

    public function show(Brand $brand)
    {
        if ($brand->getRawOriginal('logo_url')) {
            $brand->logo_url = url('/api/admin/brands/' . $brand->id . '/logo');
        }
        return response()->json($brand);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('logo')) {
            $data['logo_url'] = $request->file('logo')->store('brands', 'public');
        }

        $brand = Brand::create($data);

        return response()->json($brand);
    }

    public function update(Request $request, Brand $brand)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:4096',
            'remove_logo' => 'nullable|boolean',
        ]);

        if ($request->boolean('remove_logo') && $brand->getRawOriginal('logo_url')) {
            Storage::disk('public')->delete($brand->getRawOriginal('logo_url'));
            $data['logo_url'] = null;
        }

        if ($request->hasFile('logo')) {
            if ($brand->getRawOriginal('logo_url')) {
                Storage::disk('public')->delete($brand->getRawOriginal('logo_url'));
            }
            $data['logo_url'] = $request->file('logo')->store('brands', 'public');
        }

        $brand->update($data);

        return response()->json($brand);
    }

    public function destroy(Brand $brand)
    {
        if ($brand->getRawOriginal('logo_url')) {
            Storage::disk('public')->delete($brand->getRawOriginal('logo_url'));
        }

        $brand->delete();

        return response()->json(['success' => true]);
    }

    public function logo(Brand $brand)
    {
        $path = $brand->getRawOriginal('logo_url');
        abort_unless($path && Storage::disk('public')->exists($path), 404);

        return response()->file(Storage::disk('public')->path($path));
    }
}
