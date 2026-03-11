<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        return Brand::select(
            'id',
            'name',
            'slug'
        )
        ->orderBy('name')
        ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255'
        ]);

        $brand = Brand::create($data);

        return response()->json($brand);
    }
}