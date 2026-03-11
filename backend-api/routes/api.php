<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Catalog Controllers (Public API)
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\Catalog\ProductController;
use App\Http\Controllers\Api\Catalog\CategoryController;
use App\Http\Controllers\Api\Catalog\BrandController;
use App\Http\Controllers\Api\Catalog\SearchController;
use App\Http\Controllers\Api\Catalog\AttributeController;


/*
|--------------------------------------------------------------------------
| Admin Controllers (Admin API)
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\AttributeController as AdminAttributeController;
use App\Http\Controllers\Api\Admin\ProductImageController as AdminProductImageController;
use App\Http\Controllers\Api\Admin\ProductAliasController as AdminProductAliasController;
use App\Http\Controllers\Api\Admin\CrossReferenceController as AdminCrossReferenceController;
use App\Http\Controllers\Api\Admin\ProductAttributeController as AdminProductAttributeController;
use App\Http\Controllers\Api\Admin\ProductCategoryController as AdminProductCategoryController;



/*
|--------------------------------------------------------------------------
| Catalog API
|--------------------------------------------------------------------------
*/

Route::prefix('catalog')->group(function () {

    Route::get('/search', [SearchController::class, 'search']);
    Route::get('/search/suggest', [SearchController::class, 'suggest']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}/products', [CategoryController::class, 'products']);

    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/brands/{slug}/products', [BrandController::class, 'products']);

    Route::get('/attributes', [AttributeController::class, 'index']);

});



/*
|--------------------------------------------------------------------------
| Admin API
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */

    Route::post('/products', [AdminProductController::class, 'store']);
    Route::get('/products/{product}/edit', [AdminProductController::class, 'edit']);
    Route::put('/products/{product}', [AdminProductController::class, 'update']);
    Route::delete('/products/{product}', [AdminProductController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | Brands
    |--------------------------------------------------------------------------
    */
    Route::get('/brands', [AdminBrandController::class, 'index']);
    Route::post('/brands', [AdminBrandController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    Route::get('/categories', [AdminCategoryController::class, 'index']);
    Route::post('/categories', [AdminCategoryController::class, 'store']);

    Route::post('/products/{product}/categories', [AdminProductCategoryController::class, 'attach']);
    Route::delete('/products/{product}/categories/{category}', [AdminProductCategoryController::class, 'detach']);


    /*
    |--------------------------------------------------------------------------
    | Images
    |--------------------------------------------------------------------------
    */

    Route::post('/products/{product}/images', [AdminProductImageController::class, 'store']);
    Route::patch('/products/{product}/images/order', [AdminProductImageController::class, 'reorder']);
    Route::delete('/product-images/{id}', [AdminProductImageController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | Aliases
    |--------------------------------------------------------------------------
    */

    Route::get('/products/{product}/aliases', [AdminProductAliasController::class, 'index']);
    Route::post('/products/{product}/aliases', [AdminProductAliasController::class, 'store']);
    Route::delete('/product-aliases/{id}', [AdminProductAliasController::class, 'destroy']);


    /*
    |--------------------------------------------------------------------------
    | Cross References
    |--------------------------------------------------------------------------
    */

    Route::get('/products/{product}/cross-references', [AdminCrossReferenceController::class, 'index']);
    Route::post('/products/{product}/cross-references', [AdminCrossReferenceController::class, 'store']);
    Route::delete('/cross-references/{id}', [AdminCrossReferenceController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    |Attributes
    |--------------------------------------------------------------------------
    */

    Route::get('/attributes', [AdminAttributeController::class, 'index']);
    Route::post('/attributes', [AdminAttributeController::class, 'store']);


    /*
    |--------------------------------------------------------------------------
    |Product Attributes
    |--------------------------------------------------------------------------
    */

    Route::post('/products/{product}/attributes', [AdminProductAttributeController::class, 'store']);
    Route::get('/products/{product}/attributes', [AdminProductAttributeController::class, 'index']);
    Route::delete('/product-attributes/{id}', [AdminProductAttributeController::class, 'destroy']);

});