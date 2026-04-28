<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $guarded = [];

    protected $fillable = [

        'name',
        'slug',
        'part_number',
        'normalized_part_number',
        'brand_id',
        'description',
        'public_description',

        'cost_price',
        'selling_price',
        'promo_price',
        'promo_start',
        'promo_end',
        'status'
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($product) {

            if (!$product->slug && $product->name) {
                $product->slug = Str::slug($product->name . '-' . $product->part_number);
            }

            if ($product->part_number) {
                $product->normalized_part_number = self::normalizePartNumber($product->part_number);
            }
        });
    }

    public static function normalizePartNumber(string $partNumber): string
    {
        return strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $partNumber));
    }

    public function aliases()
    {
        return $this->hasMany(ProductAlias::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)
            ->orderBy('sort_order');
    }

    public function thumbnail()
    {
        return $this->hasOne(ProductImage::class)
            ->orderBy('sort_order');
    }

    public function categories()
    {
        return $this->belongsToMany(
            Category::class,
            'product_categories',
            'product_id',
            'category_id'
        );
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class);
    }

    public function crossReferences()
    {
        return $this->hasMany(ProductCrossReference::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public static function generateSlug(string $name, string $partNumber): string
    {
        return Str::slug($name . '-' . $partNumber);
    }
}
