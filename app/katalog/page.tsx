import Link from 'next/link'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import { ProductCard } from '@/components/ProductCard'
import { CATEGORIES, getProducts } from '@/lib/shop'

export const metadata: Metadata = { title: 'Katalog Produk' }

type Props = { searchParams: Promise<{ kategori?: string; q?: string }> }

export default async function KatalogPage({ searchParams }: Props) {
  const { kategori, q } = await searchParams
  const category = CATEGORIES.find((c) => c === kategori)
  const query = q?.trim().slice(0, 60)
  const products = await getProducts({ category, q: query })

  const chipHref = (c?: string) => {
    const params = new URLSearchParams()
    if (c) params.set('kategori', c)
    if (query) params.set('q', query)
    const s = params.toString()
    return s ? `/katalog?${s}` : '/katalog'
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Katalog Produk</h1>

      <form action="/katalog" className="flex gap-2" role="search">
        {category && <input type="hidden" name="kategori" value={category} />}
        <label htmlFor="q" className="sr-only">
          Cari produk
        </label>
        <input id="q" name="q" defaultValue={query} placeholder="Cari produk..." className="input" />
        <button type="submit" className="btn btn-primary" aria-label="Cari">
          <Search className="size-4" />
        </button>
      </form>

      <nav aria-label="Filter kategori" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {[undefined, ...CATEGORIES].map((c) => {
          const active = c === category
          return (
            <Link
              key={c ?? 'semua'}
              href={chipHref(c)}
              aria-current={active ? 'page' : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                active
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'border border-purple-200 bg-white text-purple-700 hover:bg-purple-50'
              }`}
            >
              {c ?? 'Semua'}
            </Link>
          )
        })}
      </nav>

      {products.length === 0 ? (
        <p className="card p-8 text-center text-neutral-500">Produk tidak ditemukan.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
