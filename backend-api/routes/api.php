<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Catalog\ProductController;
use App\Http\Controllers\Api\Catalog\CategoryController;
use App\Http\Controllers\Api\Catalog\BrandController;
use App\Http\Controllers\Api\Catalog\SearchController;
use App\Http\Controllers\Api\Catalog\AttributeController;
use App\Http\Controllers\Api\Admin\ProductImageController;
use App\Http\Controllers\Api\Admin\ProductAliasController;
use App\Http\Controllers\Api\Admin\CrossReferenceController;
use App\Http\Controllers\Api\Admin\ProductAttributeController;
use App\Http\Controllers\Api\Admin\ProductCrossReferenceController;


Route::prefix('catalog')->group(function () {

    Route::get('/search', [SearchController::class, 'search']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('catalog/products/{id}', [ProductController::class, 'show']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/brands', [BrandController::class, 'index']);

    Route::get('/catalog/search/suggest', [SearchController::class, 'suggest']);
    Route::get('/catalog/categories/{slug}/products', [CategoryController::class, 'products']);
    Route::get('/catalog/brands/{slug}/products', [BrandController::class, 'products']);

    Route::get('attributes', [AttributeController::class, 'index']);

});



Route::prefix('admin')->group(function () {

    Route::post('/products', [\App\Http\Controllers\Api\Admin\ProductController::class, 'store']);
    Route::get('/products/{product}/edit', [\App\Http\Controllers\Api\Admin\ProductController::class, 'edit']);
    Route::put('/products/{product}', [\App\Http\Controllers\Api\Admin\ProductController::class, 'update']);
    Route::delete('/products/{product}', [\App\Http\Controllers\Api\Admin\ProductController::class, 'destroy']);

    Route::post('/products/{product}/categories', [\App\Http\Controllers\Api\Admin\ProductCategoryController::class, 'attach']);
    Route::delete('/products/{product}/categories/{category}', [\App\Http\Controllers\Api\Admin\ProductCategoryController::class, 'detach']);

    Route::post('/upload', [ProductImageController::class, 'upload']);
    Route::post('/products/{product}/images', [ProductImageController::class, 'store']);
    Route::delete('/product-images/{id}', [ProductImageController::class, 'destroy']);
    Route::patch(
    '/products/{product}/images/order',
    [\App\Http\Controllers\Api\Admin\ProductImageController::class, 'reorder']
);

    Route::patch('/products/{product}/images/order', [ProductImageController::class, 'reorder']);

    Route::get('/products/{product}/aliases', [ProductAliasController::class, 'index']);
    Route::post('/products/{product}/aliases', [ProductAliasController::class, 'store']);
    Route::delete('/product-aliases/{id}', [ProductAliasController::class, 'destroy']);

    Route::get('/products/{product}/cross-references', [CrossReferenceController::class, 'index']);
    Route::post('/products/{product}/cross-references', [CrossReferenceController::class, 'store']);
    Route::delete('/cross-references/{id}', [CrossReferenceController::class, 'destroy']);

    Route::post('/products/{product}/attributes', [ProductAttributeController::class, 'store']);
    Route::get(
        '/products/{product}/attributes',
        [ProductAttributeController::class,'index']
    );
    Route::delete('/product-attributes/{id}', [ProductAttributeController::class, 'destroy']);
    Route::get('/attributes', [AttributeController::class, 'index']);

    Route::post(
        '/admin/products/{product}/cross-references',
        [ProductCrossReferenceController::class,'store']
    );

    Route::get(
        '/admin/products/{product}/cross-references',
        [ProductCrossReferenceController::class,'index']
    );


});