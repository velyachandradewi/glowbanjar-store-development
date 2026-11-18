import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'glowbanjar_admin'

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export function sessionToken() {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!)
    .update(process.env.ADMIN_PASSWORD!)
    .digest('hex')
}

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export async function isAdmin() {
  if (!adminConfigured()) return false
  const value = (await cookies()).get(ADMIN_COOKIE)?.value
  return Boolean(value) && safeEqual(value!, sessionToken())
}
