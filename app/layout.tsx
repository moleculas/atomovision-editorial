import type { Metadata } from 'next'
import { geistMono } from '@/lib/fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AtomoVisión - Libros digitales y físicos',
    template: '%s | AtomoVisión',
  },
  description: 'Descubre nuestra colección de libros en una experiencia 3D inmersiva.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={geistMono.variable}>
      <body className="font-geist-mono antialiased">
        {children}
      </body>
    </html>
  )
}
