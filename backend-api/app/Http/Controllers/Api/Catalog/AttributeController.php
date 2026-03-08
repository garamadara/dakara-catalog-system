<?php

namespace App\Http\Controllers\Api\Catalog;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    public function index(Request $request)
    {
        $query = Attribute::query();

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        return response()->json([
            'data' => $query->orderBy('id')->get()
        ]);
    }
}