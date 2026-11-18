import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { AddToCartButton } from '@/components/cart'
import { ProductImage } from '@/components/ProductCard'
import { getProduct, orderLink, rupiah } from '@/lib/shop'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).id)
  return { title: product?.name ?? 'Produk' }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).id)
  if (!product) notFound()
  const soldOut = product.stock <= 0

  return (
    <div className="flex flex-col gap-4">
      <Link href="/katalog" className="flex w-fit items-center gap-1 text-sm font-semibold text-purple-700 hover:underline">
        <ChevronLeft className="size-4" /> Kembali ke katalog
      </Link>
      <div className="card grid gap-6 overflow-hidden p-4 sm:p-6 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl">
          <ProductImage product={product} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700">{product.category}</span>
            {product.is_best_seller && (
              <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-amber-950">Best Seller</span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
          <p className="text-2xl font-extrabold text-purple-700">{rupiah(product.price)}</p>
          <p className={`text-sm font-semibold ${soldOut ? 'text-red-500' : 'text-emerald-600'}`}>
            {soldOut ? 'Stok habis' : `Stok tersedia: ${product.stock}`}
          </p>
          {product.description && (
            <p className="text-pretty leading-relaxed text-neutral-700">{product.description}</p>
          )}
          <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
            <a
              href={orderLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={soldOut}
              className={`btn btn-wa flex-1 ${soldOut ? 'pointer-events-none opacity-50' : ''}`}
            >
              Beli via WA
            </a>
            <AddToCartButton product={product} full />
          </div>
        </div>
      </div>
    </div>
  )
}
