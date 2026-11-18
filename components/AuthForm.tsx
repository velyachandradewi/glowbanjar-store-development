'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signIn, signUp } from '@/app/auth/actions'

export function AuthForm({ mode, next, notice }: { mode: 'masuk' | 'daftar'; next?: string; notice?: string }) {
  const [state, action, pending] = useActionState(mode === 'masuk' ? signIn : signUp, null)
  const isLogin = mode === 'masuk'

  return (
    <form action={action} className="card mx-auto flex max-w-sm flex-col gap-3 p-6">
      <h1 className="text-xl font-extrabold">{isLogin ? 'Masuk ke GlowBanjar' : 'Daftar Akun'}</h1>
      {notice && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{notice}</p>}
      {next && <input type="hidden" name="next" value={next} />}
      <label htmlFor="email" className="text-sm font-semibold text-neutral-700">
        Email
      </label>
      <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      <label htmlFor="password" className="text-sm font-semibold text-neutral-700">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        minLength={isLogin ? undefined : 8}
        autoComplete={isLogin ? 'current-password' : 'new-password'}
        className="input"
      />
      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state?.info && (
        <p role="status" className="text-sm text-green-700">
          {state.info}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? 'Memproses...' : isLogin ? 'Masuk' : 'Daftar'}
      </button>
      <p className="text-center text-sm text-neutral-600">
        {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
        <Link href={isLogin ? '/daftar' : '/masuk'} className="font-bold text-purple-700">
          {isLogin ? 'Daftar' : 'Masuk'}
        </Link>
      </p>
    </form>
  )
}
