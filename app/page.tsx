import Link from 'next/link'
import { Brush, Droplets, Flower2, MapPin, Sparkles, Star } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { ADDRESS, CATEGORIES, getProducts } from '@/lib/shop'

const CATEGORY_STYLE = {
  Skincare: { icon: Sparkles, bg: 'from-pink-100 to-pink-200', fg: 'text-pink-700' },
  Bodycare: { icon: Droplets, bg: 'from-amber-100 to-amber-200', fg: 'text-amber-800' },
  Makeup: { icon: Brush, bg: 'from-fuchsia-100 to-fuchsia-200', fg: 'text-fuchsia-700' },
  Parfum: { icon: Flower2, bg: 'from-purple-100 to-purple-200', fg: 'text-purple-700' },
} as const

const TESTIMONIALS = [
  { name: 'Rina, Banjarmasin Utara', text: 'Serum vitamin C-nya cocok banget buat kulitku. Wajah jadi cerah, adminnya ramah dan cepat balas WA.' },
  { name: 'Aulia, Banjarbaru', text: 'Barang original dan packing rapi. Sunscreen-nya ringan, tidak lengket di cuaca panas Banjar.' },
  { name: 'Siti, Banjarmasin Selatan', text: 'Harga bersahabat, pilihan lengkap. Body lotion gold shimmer-nya wangi dan tahan lama.' },
]

export default async function HomePage() {
  const bestSellers = await getProducts({ bestSeller: true, limit: 4 })

  return (
    <div className="flex flex-col gap-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-fuchsia-600 to-purple-700 px-6 py-12 text-white sm:px-12 sm:py-16">
        <div aria-hidden className="absolute -right-10 -top-10 size-48 rounded-full bg-amber-300/30 blur-2xl" />
        <div aria-hidden className="absolute -bottom-16 left-10 size-48 rounded-full bg-pink-300/30 blur-2xl" />
        <div className="relative flex max-w-xl flex-col gap-4">
          <span className="w-fit rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-amber-950">
            Toko Skincare &amp; Kosmetik Banjarmasin
          </span>
          <h1 className="text-balance text-3xl font-extrabold leading-tight sm:text-5xl">
            GlowBanjar - Glowing Ala Urang Banjar
          </h1>
          <p className="text-pretty text-pink-50 sm:text-lg">
            Skincare, bodycare, makeup, dan parfum pilihan untuk kulit tropis. Order gampang lewat WhatsApp.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/katalog" className="btn bg-white text-purple-700 hover:bg-pink-50">
              Lihat Katalog
            </Link>
            <Link href="#lokasi" className="btn border border-white/60 text-white hover:bg-white/10">
              Lokasi Toko
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="kategori">
        <h2 id="kategori" className="mb-4 text-xl font-extrabold sm:text-2xl">
          Kategori
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {CATEGORIES.map((c) => {
            const { icon: Icon, bg, fg } = CATEGORY_STYLE[c]
            return (
              <Link
                key={c}
                href={`/katalog?kategori=${c}`}
                className={`card flex flex-col items-center gap-2 bg-gradient-to-br ${bg} p-5 text-center font-bold ${fg} transition-shadow hover:shadow-lg`}
              >
                <Icon className="size-7" />
                {c}
              </Link>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="best-seller">
        <div className="mb-4 flex items-end justify-between">
          <h2 id="best-seller" className="text-xl font-extrabold sm:text-2xl">
            Produk Best Seller
          </h2>
          <Link href="/katalog" className="text-sm font-semibold text-purple-700 hover:underline">
            Lihat semua
          </Link>
        </div>
        {bestSellers.length === 0 ? (
          <p className="card p-6 text-center text-neutral-500">Belum ada produk best seller.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="testimoni">
        <h2 id="testimoni" className="mb-4 text-xl font-extrabold sm:text-2xl">
          Kata Mereka
        </h2>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex flex-col gap-3 p-5">
              <div className="flex gap-0.5 text-amber-400" aria-label="Bintang 5 dari 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm text-neutral-700">{t.text}</blockquote>
              <figcaption className="text-sm font-bold text-purple-700">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="lokasi" aria-labelledby="lokasi-title" className="card flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
            <MapPin className="size-5" />
          </span>
          <div>
            <h2 id="lokasi-title" className="text-lg font-extrabold">
              Kunjungi Toko Kami di Banjarmasin
            </h2>
            <p className="text-sm text-neutral-600">{ADDRESS}</p>
            <p className="text-sm text-neutral-600">Buka setiap hari, 09.00 - 21.00 WITA</p>
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Buka Google Maps
        </a>
      </section>
    </div>
  )
}
