import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'rate chevy',
  description: 'an app from chevy to jen',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'rate chevy',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👩🏻‍❤️‍💋‍👨🏻</text></svg>',
    apple: "/apple_icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: '#f472b6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
