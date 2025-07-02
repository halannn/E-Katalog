<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $products = Product::with('category')->latest()->get();

        if (auth()->check() && auth()->user()->status === 'admin') {

            return Inertia::render('admin/products/index', [
                'products' => $products
            ]);
        }

        return Inertia::render('home', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return Inertia::render('admin/products/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        // 1. Validasi semua input dari form
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'sku'         => 'required|string|max:100|unique:products,sku', // Pastikan SKU unik
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id', // Pastikan kategori ada
            'status'      => 'required|in:Draft,Tersedia,Kosong',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validasi file gambar
        ]);

        // 2. Proses upload gambar jika ada
        if ($request->hasFile('image')) {
            // Simpan gambar di 'storage/app/public/products' dan dapatkan path-nya
            $imagePath = $request->file('image')->store('products', 'public');

            // Tambahkan path gambar ke dalam data yang akan disimpan
            $validated['image'] = $imagePath;
        }

        // 3. Buat produk baru di database
        Product::create($validated);

        // 4. Redirect kembali dengan pesan sukses
        return redirect()->route('admin.products.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('category');

        return Inertia::render('product', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
