<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'type',
        'options'
    ];

    protected $casts = [
        'options' => 'array'
    ];

    public function productAttributes()
    {
        return $this->hasMany(ProductAttribute::class);
    }
}