import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/AuthForm'
import { getSession } from '@/lib/admin'

export const metadata: Metadata = { title: 'Daftar', robots: { index: false } }

export default async function SignUpPage() {
  if (await getSession()) redirect('/')
  return <AuthForm mode="daftar" />
}
