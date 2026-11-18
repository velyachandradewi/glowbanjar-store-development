import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/AuthForm'
import { getSession } from '@/lib/admin'

export const metadata: Metadata = { title: 'Masuk', robots: { index: false } }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  if (await getSession()) redirect('/')
  const { next, error } = await searchParams
  return (
    <AuthForm
      mode="masuk"
      next={next}
      notice={error === 'verifikasi' ? 'Tautan verifikasi tidak valid atau kedaluwarsa.' : undefined}
    />
  )
}
