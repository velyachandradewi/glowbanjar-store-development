import { supabase } from './supabase'

export type Product = {
  id: string
  name: string
  price: number
  category: string
  image_url: string | null
  stock: number
  description: string | null
  is_best_seller: boolean
  created_at: string
}

export const CATEGORIES = ['Skincare', 'Bodycare', 'Makeup', 'Parfum'] as const

export const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281234567890'
export const ADDRESS = 'Jl. Pangeran Antasari No. 12, Banjarmasin, Kalimantan Selatan'

export const rupiah = (n: number) => 'Rp ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export const waLink = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`

export const orderLink = (productName: string) => waLink(`Halo GlowBanjar, mau order ${productName}`)

type Query = { category?: string; q?: string; bestSeller?: boolean; limit?: number }

export async function getProducts({ category, q, bestSeller, limit }: Query = {}): Promise<Product[]> {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (category) query = query.eq('category', category)
  if (bestSeller) query = query.eq('is_best_seller', true)
  if (q) query = query.ilike('name', `%${q.replace(/[%_\\]/g, '')}%`)
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  if (error) {
    console.error('getProducts failed:', error.message)
    return []
  }
  return data as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
  return (data as Product) ?? null
}
