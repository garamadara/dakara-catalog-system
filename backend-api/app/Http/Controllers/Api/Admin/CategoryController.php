<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('name')->get()->map(function (Category $category) {
            if ($category->getRawOriginal('image_url')) {
                $category->image_url = url('/api/admin/categories/' . $category->id . '/image');
            }
            return $category;
        });

        return response()->json($categories);
    }

    public function show(Category $category)
    {
        if ($category->getRawOriginal('image_url')) {
            $category->image_url = url('/api/admin/categories/' . $category->id . '/image');
        }

        return response()->json($category);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'parent_id' => 'nullable|integer',
            'image' => 'nullable|image|max:4096',
        ]);

        if ($request->hasFile('image')) {
            $data['image_url'] = $request->file('image')->store('categories', 'public');
        }

        $category = Category::create($data);

        return response()->json($category);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'parent_id' => 'nullable|integer',
            'image' => 'nullable|image|max:4096',
            'remove_image' => 'nullable|boolean',
        ]);

        if ($request->boolean('remove_image') && $category->getRawOriginal('image_url')) {
            Storage::disk('public')->delete($category->getRawOriginal('image_url'));
            $data['image_url'] = null;
        }

        if ($request->hasFile('image')) {
            if ($category->getRawOriginal('image_url')) {
                Storage::disk('public')->delete($category->getRawOriginal('image_url'));
            }
            $data['image_url'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($data);

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        if ($category->getRawOriginal('image_url')) {
            Storage::disk('public')->delete($category->getRawOriginal('image_url'));
        }

        $category->delete();

        return response()->json(['success' => true]);
    }

    public function image(Category $category)
    {
        $path = $category->getRawOriginal('image_url');
        abort_unless($path && Storage::disk('public')->exists($path), 404);

        return response()->file(Storage::disk('public')->path($path));
    }
}
