import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Footer, Header } from '@/components/SiteChrome'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'GlowBanjar - Toko Skincare & Kosmetik Banjarmasin', template: '%s | GlowBanjar' },
  description:
    'GlowBanjar, toko skincare, bodycare, makeup, dan parfum di Banjarmasin. Glowing ala urang Banjar, order mudah via WhatsApp.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#7c3aed',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className="light">
      <body className={`${jakarta.className} min-h-screen bg-[#fff7fb] text-neutral-900 antialiased`}>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
