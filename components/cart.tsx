'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { rupiah, waLink } from '@/lib/shop'

type Item = { id: string; name: string; price: number; qty: number }

const KEY = 'glowbanjar-cart'
const EVENT = 'glowbanjar-cart-change'

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

const readRaw = () => localStorage.getItem(KEY) ?? '[]'

function useCart() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => '[]')
  return useMemo<Item[]>(() => {
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  }, [raw])
}

function write(items: Item[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(EVENT))
}

function add(item: Omit<Item, 'qty'>, max: number) {
  const items: Item[] = JSON.parse(readRaw())
  const found = items.find((i) => i.id === item.id)
  if (found) found.qty = Math.min(found.qty + 1, max)
  else items.push({ ...item, qty: 1 })
  write(items)
}

function setQty(id: string, qty: number) {
  write(
    (JSON.parse(readRaw()) as Item[])
      .map((i) => (i.id === id ? { ...i, qty } : i))
      .filter((i) => i.qty > 0),
  )
}

export function CartBadge() {
  const count = useCart().reduce((n, i) => n + i.qty, 0)
  return (
    <Link
      href="/keranjang"
      aria-label={`Keranjang, ${count} item`}
      className="relative flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100"
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}

export function AddToCartButton({
  product,
  full,
}: {
  product: { id: string; name: string; price: number; stock: number }
  full?: boolean
}) {
  const soldOut = product.stock <= 0
  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => add({ id: product.id, name: product.name, price: product.price }, product.stock)}
      className={`btn btn-ghost ${full ? 'flex-1' : ''}`}
      aria-label={`Tambah ${product.name} ke keranjang`}
    >
      <ShoppingBag className="size-4" />
      {full && 'Keranjang'}
    </button>
  )
}

export function CartView() {
  const items = useCart()
  const total = items.reduce((n, i) => n + i.price * i.qty, 0)

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 p-10 text-center">
        <ShoppingBag className="size-10 text-purple-300" />
        <p className="text-neutral-600">Keranjang kamu masih kosong.</p>
        <Link href="/katalog" className="btn btn-primary">
          Belanja Sekarang
        </Link>
      </div>
    )
  }

  const message =
    'Halo GlowBanjar, mau order:\n' +
    items.map((i) => `- ${i.name} x${i.qty} (${rupiah(i.price * i.qty)})`).join('\n') +
    `\nTotal: ${rupiah(total)}`

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {items.map((i) => (
          <li key={i.id} className="card flex items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-neutral-900">{i.name}</p>
              <p className="text-sm text-purple-700">{rupiah(i.price)}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQty(i.id, i.qty - 1)}
                aria-label="Kurangi jumlah"
                className="flex size-8 items-center justify-center rounded-full bg-purple-50 text-purple-700"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
              <button
                type="button"
                onClick={() => setQty(i.id, i.qty + 1)}
                aria-label="Tambah jumlah"
                className="flex size-8 items-center justify-center rounded-full bg-purple-50 text-purple-700"
              >
                <Plus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setQty(i.id, 0)}
                aria-label={`Hapus ${i.name}`}
                className="ml-1 flex size-8 items-center justify-center rounded-full text-neutral-400 hover:text-red-500"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="card flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">Total</span>
          <span className="text-xl font-bold text-purple-700">{rupiah(total)}</span>
        </div>
        <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
          Pesan Semua via WA
        </a>
      </div>
    </div>
  )
}
