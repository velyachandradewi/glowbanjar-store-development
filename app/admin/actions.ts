'use server'

import { createHash } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ADMIN_COOKIE, adminConfigured, isAdmin, safeEqual, sessionToken } from '@/lib/admin'
import { adminClient } from '@/lib/supabase'
import { CATEGORIES } from '@/lib/shop'

const hash = (s: string) => createHash('sha256').update(s).digest('hex')

export async function login(_: string | null, formData: FormData) {
  if (!adminConfigured()) return 'ADMIN_PASSWORD belum diatur.'
  const password = String(formData.get('password') ?? '')
  if (!safeEqual(hash(password), hash(process.env.ADMIN_PASSWORD!))) return 'Password salah.'
  ;(await cookies()).set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 60 * 60 * 8,
  })
  redirect('/admin')
}

export async function logout() {
  ;(await cookies()).delete({ name: ADMIN_COOKIE, path: '/admin' })
  redirect('/admin')
}

export async function saveProduct(formData: FormData) {
  if (!(await isAdmin())) redirect('/admin')

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
  if (!(await isAdmin())) redirect('/admin')
  await adminClient().from('products').delete().eq('id', String(formData.get('id')))
  revalidatePath('/', 'layout')
  redirect('/admin')
}
