import { redirect } from 'next/navigation'
import { cache } from 'react'
import { adminClient } from './supabase'
import { createAuthClient } from './supabase-server'

export type Role = 'admin' | 'user'

// Sumber kebenaran peran adalah tabel profiles (hanya bisa diubah service role di server).
// Email di ADMIN_EMAIL yang sudah terverifikasi otomatis dipromosikan menjadi admin.
export const getSession = cache(async () => {
  const supabase = await createAuthClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const db = adminClient().from('profiles')
  const { data } = await db.select('role').eq('id', user.id).maybeSingle()
  let role: Role = data?.role === 'admin' ? 'admin' : 'user'

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (role !== 'admin' && adminEmail && user.email_confirmed_at && user.email?.toLowerCase() === adminEmail) {
    await db.upsert({ id: user.id, email: user.email, role: 'admin' })
    role = 'admin'
  }

  return { id: user.id, email: user.email ?? '', role }
})

export async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/masuk?next=/admin')
  if (session.role !== 'admin') redirect('/?akses=ditolak')
  return session
}
