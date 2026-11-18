import type { Metadata } from 'next'
import { CartView } from '@/components/cart'

export const metadata: Metadata = { title: 'Keranjang' }

export default function KeranjangPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Keranjang</h1>
      <CartView />
    </div>
  )
}
