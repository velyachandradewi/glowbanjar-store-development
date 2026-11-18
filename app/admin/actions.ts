'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/admin'
import { adminClient } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/shop'

export async function saveProduct(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') ?? '')
  const category = String(formData.get('category') ?? '')
  const row = {
    name: String(formData.get('name') ?? '').trim(),
    price: Math.max(0, Math.trunc(Number(formData.get('price')) || 0)),
    stock: Math.max(0, Math.trunc(Number(formData.get('stock')) || 0)),
    category: (CATEGORIES as readonly string[]).includes(category) ? category : CATEGORIES[0],
    image_url: String(formData.get('image_url') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim() || null,
    is_best_seller: formData.get('is_best_seller') === 'on',
  }
  if (!row.name) redirect(`/admin/produk/${id || 'baru'}?error=nama`)

  const db = adminClient().from('products')
  const { error } = id ? await db.update(row).eq('id', id) : await db.insert(row)
  if (error) redirect(`/admin/produk/${id || 'baru'}?error=gagal`)

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin()
  await adminClient().from('products').delete().eq('id', String(formData.get('id')))
  revalidatePath('/', 'layout')
  redirect('/admin')
}
