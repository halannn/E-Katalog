import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Helper untuk format mata uang
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default function ProductShow({ product }) {
    const { post, processing } = useForm();
    const [quantity, setQuantity] = useState(1);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Produk', href: route('home') },
        { title: product.name, href: route('products.show', product) },
    ];

    const handleAddToCart = (e) => {
        e.preventDefault();
        post(route('cart.store'), {
            data: {
                product_id: product.id,
                quantity: quantity,
            },
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${product.name} (x${quantity}) berhasil ditambahkan.`);
            },
            onError: () => {
                toast.error('Gagal menambahkan produk.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                    {/* Gambar */}
                    <div>
                        <img
                            src={`/storage/${product.image}`}
                            alt={product.name}
                            className="aspect-square w-full rounded-lg object-cover shadow-lg"
                        />
                    </div>

                    {/* Info Produk */}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
                        <p className="mt-2 text-3xl tracking-tight text-gray-900">{formatCurrency(product.price)}</p>

                        {/* (Placeholder) Review */}
                        <div className="mt-4 flex items-center">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="ml-2 text-sm text-muted-foreground">(117 ulasan)</p>
                        </div>

                        <div className="mt-6">
                            <p className="text-base text-muted-foreground">{product.description}</p>
                        </div>

                        <form onSubmit={handleAddToCart} className="mt-8">
                            <div className="flex items-center gap-4">
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                                    className="h-12 w-24 text-center text-lg"
                                    min="1"
                                />
                                <Button type="submit" size="lg" className="h-12 w-full text-lg" disabled={processing}>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Tambah ke Keranjang
                                </Button>
                            </div>
                        </form>

                        <Separator className="my-8" />

                        <div>
                            <h3 className="text-lg font-semibold">Detail Produk</h3>
                            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
                                <li>Stok Tersedia: {product.stock}</li>
                                <li>Kategori: {product.category.name}</li>
                                <li>SKU: {product.sku}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
