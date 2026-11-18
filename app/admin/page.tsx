import Link from 'next/link'
import type { Metadata } from 'next'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { requireAdmin } from '@/lib/admin'
import { getProducts, rupiah } from '@/lib/shop'
import { signOut } from '@/app/auth/actions'
import { deleteProduct } from './actions'

export const metadata: Metadata = { title: 'Admin', robots: { index: false } }

export default async function AdminPage() {
  await requireAdmin()

  const products = await getProducts()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-extrabold">Admin Produk</h1>
        <div className="flex gap-2">
          <Link href="/admin/produk/baru" className="btn btn-primary">
            <Plus className="size-4" /> Tambah
          </Link>
          <form action={signOut}>
            <button type="submit" className="btn btn-ghost">
              Keluar
            </button>
          </form>
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {products.map((p) => (
          <li key={p.id} className="card flex items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.name}</p>
              <p className="text-sm text-neutral-500">
                {p.category} &middot; {rupiah(p.price)} &middot; stok {p.stock}
                {p.is_best_seller && ' · Best Seller'}
              </p>
            </div>
            <Link
              href={`/admin/produk/${p.id}`}
              aria-label={`Edit ${p.name}`}
              className="flex size-9 items-center justify-center rounded-full bg-purple-50 text-purple-700"
            >
              <Pencil className="size-4" />
            </Link>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                aria-label={`Hapus ${p.name}`}
                className="flex size-9 items-center justify-center rounded-full bg-red-50 text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
