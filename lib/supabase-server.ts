import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_ANON_KEY, SUPABASE_URL, cookieOptions } from './supabase'

export async function createAuthClient() {
  const store = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookieOptions,
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options))
        } catch {
          // Dipanggil dari Server Component: sesi dipulihkan oleh proxy.ts.
        }
      },
    },
  })
}
