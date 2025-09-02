import type { Metadata } from 'next'
import { geistMono } from '@/lib/fonts'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AtomoVisión - Editorial de libros de ciencia ficción y fantasía con IA',
    template: '%s | AtomoVisión',
  },
  description: 'Editorial pionera en libros de ciencia ficción y fantasía generados por inteligencia artificial. Descubre mundos únicos y experiencias literarias innovadoras.',
  keywords: 'libros ciencia ficción, libros fantasía, editorial digital, libros IA, inteligencia artificial literatura, ebooks fantasía, novelas ciencia ficción, AtomoVisión',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  authors: [{ name: 'AtomoVisión Editorial' }],
  publisher: 'AtomoVisión',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'AtomoVisión - Editorial de libros de ciencia ficción y fantasía con IA',
    description: 'Editorial pionera en libros de ciencia ficción y fantasía generados por inteligencia artificial.',
    url: 'https://www.atomovision.es',
    siteName: 'AtomoVisión',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AtomoVisión - Editorial de ciencia ficción y fantasía',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AtomoVisión - Editorial de libros de ciencia ficción y fantasía con IA',
    description: 'Editorial pionera en libros de ciencia ficción y fantasía generados por inteligencia artificial.',
    site: '@AtomovisionEd',
    creator: '@AtomovisionEd',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.atomovision.es',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AtomoVisión',
    url: 'https://www.atomovision.es',
    logo: 'https://www.atomovision.es/logo.png',
    description: 'Editorial pionera en libros de ciencia ficción y fantasía generados por inteligencia artificial.',
    sameAs: [
      'https://x.com/AtomovisionEd',
      'https://www.facebook.com/AtomovisionEd',
      'https://www.instagram.com/atomovisioned/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@atomovision.es',
      availableLanguage: 'Spanish',
    },
  }

  return (
    <html lang="es" className={geistMono.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-geist-mono antialiased">
        {children}
      </body>
    </html>
  )
}
