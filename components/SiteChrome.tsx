import Link from 'next/link'
import { MapPin, Sparkles } from 'lucide-react'
import { ADDRESS } from '@/lib/shop'
import { CartBadge } from './cart'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-purple-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white">
            <Sparkles className="size-4" />
          </span>
          <span className="bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent">
            GlowBanjar
          </span>
        </Link>
        <nav aria-label="Menu utama" className="flex items-center gap-1 text-sm font-semibold text-neutral-700 sm:gap-3">
          <Link href="/" className="hidden rounded-full px-3 py-2 hover:bg-purple-50 sm:block">
            Beranda
          </Link>
          <Link href="/katalog" className="rounded-full px-3 py-2 hover:bg-purple-50">
            Katalog
          </Link>
          <CartBadge />
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-br from-purple-900 to-purple-950 text-purple-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="text-lg font-extrabold text-amber-300">GlowBanjar</p>
          <p className="mt-1 text-sm text-purple-200">
            Toko skincare &amp; kosmetik di Banjarmasin. Glowing ala urang Banjar.
          </p>
        </div>
        <address className="flex items-start gap-2 text-sm not-italic">
          <MapPin className="mt-0.5 size-4 shrink-0 text-amber-300" />
          <span>{ADDRESS}</span>
        </address>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-purple-300">
        &copy; {new Date().getFullYear()} GlowBanjar. Banjarmasin, Kalimantan Selatan.
      </p>
    </footer>
  )
}
