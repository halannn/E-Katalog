<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::controller(CartController::class)->group(function () {
        Route::get('/cart', 'index')->name('cart.index');
        Route::post('/cart', 'store')->name('cart.store');
        Route::patch('/cart/{cart}', 'update')->name('cart.update');
        Route::delete('/cart/{cart}', 'destroy')->name('cart.destroy');
    });

    Route::prefix('/dashboard')
        ->name('admin.')
        ->group(function () {
            Route::controller(ProductController::class)->group(function () {
                Route::get('/products', 'index')->name('products.index');
                Route::get('/products/create', 'create')->name('products.create');
                Route::post('/products', 'store')->name('products.store');
                Route::get('/product/{product}', 'show')->name('products.show');
                Route::get('/product/{product}/edit', 'edit')->name('products.edit');
                Route::put('/product/{product}', 'update')->name('products.update');
                Route::delete('/product/{product}', 'destroy')->name('products.destroy');
            });
        });
});

Route::get('/', [ProductController::class, 'index'], function () {})->name('home');
Route::get('/{product}', [ProductController::class, 'show'], function () {})->name('products.show');