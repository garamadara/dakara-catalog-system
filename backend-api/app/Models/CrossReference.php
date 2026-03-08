<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrossReference extends Model
{
    protected $guarded = [];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($ref) {
            $ref->normalized_part_number =
                Product::normalizePartNumber($ref->part_number);
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
