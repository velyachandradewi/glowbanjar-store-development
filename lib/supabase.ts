import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
})

// Server-only: menulis ke products/profiles. Hanya dipanggil setelah requireAdmin() atau di lib/admin.ts.
export function adminClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
}

// Preview v0 tampil di iframe lintas-situs, jadi cookie sesi perlu SameSite=None saat development.
export const cookieOptions =
  process.env.NODE_ENV === 'production'
    ? { sameSite: 'lax' as const, secure: true }
    : { sameSite: 'none' as const, secure: true }
