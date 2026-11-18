'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/admin'
import { createAuthClient } from '@/lib/supabase-server'

export type AuthState = { error?: string; info?: string } | null

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? '')
  return next.startsWith('/') && !next.startsWith('//') ? next : ''
}

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) return { error: 'Email dan password wajib diisi.' }

  const supabase = await createAuthClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return {
      error: /confirm/i.test(error.message)
        ? 'Email belum diverifikasi. Cek kotak masuk Anda.'
        : 'Email atau password salah.',
    }
  }

  const session = await getSession()
  redirect(session?.role === 'admin' ? safeNext(formData.get('next')) || '/admin' : '/')
}

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email) return { error: 'Email wajib diisi.' }
  if (password.length < 8) return { error: 'Password minimal 8 karakter.' }

  const origin = (await headers()).get('origin') ?? ''
  const supabase = await createAuthClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${origin}/auth/callback` },
  })
  if (error) {
    return { error: /registered|exists/i.test(error.message) ? 'Email sudah terdaftar.' : error.message }
  }
  return { info: 'Pendaftaran berhasil. Cek email Anda untuk verifikasi, lalu masuk.' }
}

export async function signOut() {
  const supabase = await createAuthClient()
  await supabase.auth.signOut()
  redirect('/')
}
