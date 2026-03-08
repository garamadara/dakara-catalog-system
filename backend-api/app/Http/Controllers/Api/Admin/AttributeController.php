<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attribute;

class AttributeController extends Controller
{
    public function index()
    {
        return Attribute::select(
            'id',
            'name',
            'slug',
            'type',
            'options'
        )
        ->orderBy('name')
        ->get();
    }
}