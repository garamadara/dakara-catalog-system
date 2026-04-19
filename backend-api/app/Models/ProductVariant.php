<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id',
        'sku',
        'part_number',
        'cost_price',
        'selling_price',
        'promo_price',
        'stock',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
