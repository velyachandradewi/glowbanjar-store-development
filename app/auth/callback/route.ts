import { NextResponse, type NextRequest } from 'next/server'
import { createAuthClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  if (code) {
    const supabase = await createAuthClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}/`)
  }
  return NextResponse.redirect(`${origin}/masuk?error=verifikasi`)
}
