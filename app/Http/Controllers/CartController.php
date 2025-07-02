<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil item keranjang untuk user yang sedang login
        // Gunakan 'with('product')' untuk eager loading data produk (sangat penting untuk performa)
        $cartItems = Cart::with('product.category')
            ->where('user_id', auth()->id())
            ->get();

        // Hitung total harga
        $totalPrice = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return Inertia::render('cart', [
            'cartItems' => $cartItems,
            'totalPrice' => $totalPrice,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'sometimes|integer|min:1'
        ]);

        $product_id = $request->input('product_id');
        $quantity = $request->input('quantity', 1); // Default kuantitas 1

        // Cek apakah item sudah ada di keranjang user
        $cartItem = Cart::where('user_id', auth()->id())
            ->where('product_id', $product_id)
            ->first();

        if ($cartItem) {
            // Jika sudah ada, tambahkan kuantitasnya
            $cartItem->increment('quantity', $quantity);
        } else {
            // Jika belum ada, buat entri baru
            Cart::create([
                'user_id' => auth()->id(),
                'product_id' => $product_id,
                'quantity' => $quantity,
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cart $cart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart $cart)
    {
        // Otorisasi: pastikan user hanya bisa mengupdate keranjangnya sendiri
        if ($cart->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate(['quantity' => 'required|integer|min:1']);

        $cart->update(['quantity' => $request->quantity]);

        return back()->with('success', 'Kuantitas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart)
    {
        // Otorisasi: pastikan user hanya bisa menghapus dari keranjangnya sendiri
        if ($cart->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $cart->delete();

        return back()->with('success', 'Produk berhasil dihapus dari keranjang.');
    }
}
