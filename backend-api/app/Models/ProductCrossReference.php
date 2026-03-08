<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCrossReference extends Model
{
    protected $fillable = [
        'product_id',
        'reference_product_id'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function reference()
    {
        return $this->belongsTo(Product::class,'reference_product_id');
    }
}