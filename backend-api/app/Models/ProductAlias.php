<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAlias extends Model
{
    protected $fillable = [
        'product_id',
        'alias'
    ];

    protected $guarded = [];

     protected static function boot()
    {
        parent::boot();

        static::saving(function ($alias) {
            $alias->normalized_alias = Product::normalizePartNumber($alias->alias);
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
