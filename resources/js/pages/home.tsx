import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/',
    },
];

export default function Products({ products, auth }) {
    const { post, processing } = useForm();

    const handleAddToCart = (productId: number) => {
        post(route('cart.store', { product_id: productId }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produk berhasil ditambahkan ke keranjang.');
            },
            onError: () => {
                toast.error('Gagal menambahkan produk.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="bg-white">
                    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                        <div className="flex flex-row justify-between">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Produk Toko</h2>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group relative flex flex-col justify-between rounded-2xl p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                                >
                                    {/* Link */}
                                    <Link href={route('products.show', product)}>
                                        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200">
                                            <img
                                                alt={product.name}
                                                src={`/storage/${product.image}`}
                                                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <h3 className="text-sm text-gray-700">{product.name}</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">{product.category.name}</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">{`Rp ${product.price.toLocaleString('id-ID')}`}</p>
                                        </div>
                                    </Link>

                                    {/* Button */}
                                    {auth.user && (
                                        <div className="mt-4">
                                            <Button className="w-full" onClick={() => handleAddToCart(product.id)} disabled={processing}>
                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                Tambah
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
