<?php

namespace App\Providers;

use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::bind('product', function ($value) {
            return Product::query()
                ->where('id', $value)
                ->orWhere('slug', $value)
                ->firstOrFail();
        });
    }
}
