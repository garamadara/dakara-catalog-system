<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    public function index(): JsonResponse
    {
        $attributes = Attribute::query()
            ->select([
                'id',
                'name',
                'slug',
                'type',
                'options',
            ])
            ->orderBy('name')
            ->get();

        return response()->json($attributes);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'type' => 'required|string',
            'options' => 'nullable|array'
        ]);

        $attribute = Attribute::create($data);

        return response()->json($attribute);
    }
}