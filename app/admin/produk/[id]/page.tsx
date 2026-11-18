import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { isAdmin } from '@/lib/admin'
import { CATEGORIES, getProduct } from '@/lib/shop'
import { saveProduct } from '../../actions'

export const metadata: Metadata = { title: 'Form Produk', robots: { index: false } }

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function ProductFormPage({ params, searchParams }: Props) {
  if (!(await isAdmin())) redirect('/admin')
  const { id } = await params
  const { error } = await searchParams
  const product = id === 'baru' ? null : await getProduct(id)
  if (id !== 'baru' && !product) notFound()

  return (
    <form action={saveProduct} className="card mx-auto flex max-w-xl flex-col gap-4 p-6">
      <h1 className="text-xl font-extrabold">{product ? 'Edit Produk' : 'Tambah Produk'}</h1>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error === 'nama' ? 'Nama produk wajib diisi.' : 'Gagal menyimpan produk.'}
        </p>
      )}
      <input type="hidden" name="id" value={product?.id ?? ''} />

      <Field label="Nama" htmlFor="name">
        <input id="name" name="name" required defaultValue={product?.name} className="input" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Harga (Rp)" htmlFor="price">
          <input id="price" name="price" type="number" min={0} required defaultValue={product?.price} className="input" />
        </Field>
        <Field label="Stok" htmlFor="stock">
          <input id="stock" name="stock" type="number" min={0} required defaultValue={product?.stock ?? 0} className="input" />
        </Field>
      </div>
      <Field label="Kategori" htmlFor="category">
        <select id="category" name="category" defaultValue={product?.category} className="input">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="URL Gambar (opsional)" htmlFor="image_url">
        <input id="image_url" name="image_url" type="url" defaultValue={product?.image_url ?? ''} className="input" />
      </Field>
      <Field label="Deskripsi" htmlFor="description">
        <textarea id="description" name="description" rows={4} defaultValue={product?.description ?? ''} className="input" />
      </Field>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="is_best_seller" defaultChecked={product?.is_best_seller} className="size-4 accent-purple-600" />
        Tandai sebagai Best Seller
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary flex-1">
          Simpan
        </button>
        <Link href="/admin" className="btn btn-ghost">
          Batal
        </Link>
      </div>
    </form>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-neutral-700">
        {label}
      </label>
      {children}
    </div>
  )
}
