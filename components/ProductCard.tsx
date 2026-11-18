import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { orderLink, rupiah, type Product } from '@/lib/shop'
import { AddToCartButton } from './cart'

const GRADIENTS: Record<string, string> = {
  Skincare: 'from-pink-200 via-fuchsia-200 to-purple-300',
  Bodycare: 'from-amber-100 via-pink-200 to-pink-300',
  Makeup: 'from-rose-300 via-pink-300 to-fuchsia-400',
  Parfum: 'from-purple-300 via-fuchsia-200 to-amber-200',
}

export function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  if (product.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image_url}
        alt={product.name}
        loading="lazy"
        className={`size-full object-cover ${className}`}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={product.name}
      className={`flex size-full flex-col items-center justify-center gap-1 bg-gradient-to-br text-white/90 ${
        GRADIENTS[product.category] ?? GRADIENTS.Skincare
      } ${className}`}
    >
      <Sparkles className="size-8" />
      <span className="text-xs font-semibold tracking-widest uppercase">{product.category}</span>
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0
  return (
    <article className="card flex flex-col overflow-hidden">
      <Link href={`/produk/${product.id}`} className="group flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden">
          <ProductImage product={product} />
          {product.is_best_seller && (
            <span className="absolute left-2 top-2 rounded-full bg-amber-300 px-2.5 py-1 text-[11px] font-bold text-amber-950">
              Best Seller
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
          <span className="text-xs font-medium text-pink-600">{product.category}</span>
          <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900 group-hover:text-purple-700 sm:text-base">
            {product.name}
          </h3>
          <p className="mt-auto pt-1 font-bold text-purple-700">{rupiah(product.price)}</p>
          <p className={`text-xs ${soldOut ? 'text-red-500' : 'text-neutral-500'}`}>
            {soldOut ? 'Stok habis' : `Stok ${product.stock}`}
          </p>
        </div>
      </Link>
      <div className="flex gap-2 p-3 pt-0 sm:p-4 sm:pt-0">
        <a
          href={orderLink(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={soldOut}
          className={`btn btn-wa flex-1 px-3 ${soldOut ? 'pointer-events-none opacity-50' : ''}`}
        >
          Beli via WA
        </a>
        <AddToCartButton product={product} />
      </div>
    </article>
  )
}
