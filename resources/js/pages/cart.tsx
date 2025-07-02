import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/' },
    { title: 'Keranjang', href: route('cart.index') },
];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

// 1. Pisahkan item keranjang menjadi komponennya sendiri untuk mengelola state secara independen.
function CartItem({ item }) {
    // Setiap item memiliki instance useForm-nya sendiri.
    const {
        data,
        setData,
        patch,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        quantity: item.quantity,
    });

    // 2. Gunakan `onBlur` sebagai pengganti `debounce`. Request hanya dikirim saat user selesai mengedit.
    const handleUpdateQuantity = () => {
        // Hanya kirim request jika kuantitasnya berubah dari nilai asli
        if (data.quantity !== item.quantity) {
            patch(route('cart.update', item.id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Kuantitas diperbarui.'),
                onError: () => {
                    // Jika error, kembalikan ke nilai semula
                    setData('quantity', item.quantity);
                    toast.error('Gagal memperbarui kuantitas.');
                },
            });
        }
    };

    const handleRemoveItem = () => {
        destroy(route('cart.destroy', item.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Produk dihapus dari keranjang.'),
        });
    };

    return (
        <li key={item.id} className="flex py-6">
            <img
                src={`/storage/${item.product.image}`} // Menggunakan accessor image_url
                alt={item.product.name}
                className="h-24 w-24 rounded-md object-cover sm:h-32 sm:w-32"
            />
            <div className="ml-4 flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="text-lg font-medium">{item.product.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Label htmlFor={`quantity-${item.id}`} className="sr-only">
                            Kuantitas
                        </Label>
                        <Input
                            id={`quantity-${item.id}`}
                            type="number"
                            value={data.quantity}
                            // `setData` mengupdate state form untuk item ini saja
                            onChange={(e) => setData('quantity', e.target.value)}
                            onBlur={handleUpdateQuantity} // Kirim request saat fokus hilang
                            className="h-9 w-20"
                            disabled={processing} // `processing` hanya berlaku untuk item ini
                        />
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleRemoveItem} disabled={processing}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </li>
    );
}

// Komponen utama sekarang menjadi lebih sederhana.
export default function CartIndex({ cartItems, totalPrice }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keranjang Belanja" />

            <div className="container mx-auto max-w-4xl py-12">
                <h1 className="mb-8 text-3xl font-bold tracking-tight">Keranjang Belanja Anda</h1>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Daftar Item Keranjang */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Produk ({cartItems.length} item)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {cartItems.length > 0 ? (
                                    <ul className="divide-y">
                                        {cartItems.map((item) => (
                                            // Render komponen CartItem untuk setiap item
                                            <CartItem key={item.id} item={item} />
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="py-8 text-center text-muted-foreground">Keranjang Anda masih kosong.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Ringkasan Pesanan */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ringkasan Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pengiriman</span>
                                    <span>Gratis</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-4">
                                <Button className="w-full" size="lg" disabled={cartItems.length === 0}>
                                    Lanjutkan ke Checkout
                                </Button>
                                <Button variant="link" asChild>
                                    <Link href={route('home')}>Lanjut Belanja</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
