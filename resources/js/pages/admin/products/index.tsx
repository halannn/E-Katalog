import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

import { Button } from '@/components/ui/button';

export default function Products({ products }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="bg-white">
                    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                        <div className="flex flex-row justify-between">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Produk Toko Anda</h2>
                            <Button variant="default">
                                <Link href={route('admin.products.create')}>Tambah</Link>
                            </Button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {products.map((product) => (
                                <div key={product.id} className="group relative rounded-2xl p-4 shadow">
                                    <img
                                        src={ `/storage/${product.image}`} // Menggunakan `product.image`
                                        alt={product.description} // Menggunakan deskripsi untuk alt text
                                        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                    />
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <h3 className="text-sm text-gray-700">
                                                {/* Link sekarang lebih dinamis menggunakan SKU */}
                                                <a href={`/products/${product.sku}`}>
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.name}
                                                </a>
                                            </h3>
                                            {/* Menampilkan nama kategori, bukan warna */}
                                            <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
                                        </div>
                                        {/* Memformat harga dari angka menjadi string mata uang (Rupiah) */}
                                        <p className="text-sm font-medium text-gray-900">{`Rp ${product.price.toLocaleString('id-ID')}`}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
