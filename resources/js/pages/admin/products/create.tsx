import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: route('admin.products.index') },
    { title: 'Create', href: route('admin.products.create') },
];

// Komponen untuk menampilkan error, disesuaikan dengan warna default shadcn
const InputError = ({ message }) => (message ? <p className="mt-1 text-sm text-destructive">{message}</p> : null);

export default function CreateProduct({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        sku: '',
        description: '',
        price: '',
        stock: '',
        image: null,
        category_id: '',
        status: 'Draft',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            onSuccess: () => {
                toast.success('Berhasil menambah data.');
            },
            onError: () => {
                toast.error('Gagal menambah data.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Produk" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="py-12">
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Nama Produk */}
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="name">Nama Produk</Label>
                                        <Input id="name" type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* SKU */}
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                                        <Input id="sku" type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} required />
                                        <InputError message={errors.sku} />
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                <div className="mt-4 grid w-full gap-1.5">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Jelaskan produk Anda di sini..."
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Harga */}
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="price">Harga (Rp)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.price} />
                                    </div>

                                    {/* Stok */}
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="stock">Stok</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.stock} />
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Kategori */}
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="category_id">Kategori</Label>
                                        <Select onValueChange={(value) => setData('category_id', value)} value={data.category_id} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={String(category.id)}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category_id} />
                                    </div>

                                    {/* Status */}
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="status">Status</Label>
                                        <Select onValueChange={(value) => setData('status', value)} value={data.status}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Draft">Draft</SelectItem>
                                                <SelectItem value="Tersedia">Tersedia</SelectItem>
                                                <SelectItem value="Kosong">Kosong</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>
                                </div>

                                {/* Gambar Produk */}
                                <div className="mt-4 grid w-full items-center gap-1.5">
                                    <Label htmlFor="image">Gambar Produk</Label>
                                    <Input id="image" type="file" onChange={(e) => setData('image', e.target.files[0])} />
                                    <InputError message={errors.image} />
                                </div>

                                {/* Tombol Aksi */}
                                <div className="mt-6 flex items-center justify-end gap-4">
                                    <Button variant="ghost" asChild>
                                        <Link href={route('admin.products.index')}>Batal</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Produk'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
