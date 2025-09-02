import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo de libros de ciencia ficción y fantasía',
  description: 'Explora nuestro catálogo completo de libros de ciencia ficción y fantasía generados por IA. Encuentra tu próxima aventura literaria en AtomoVisión.',
  keywords: 'catálogo libros, libros ciencia ficción, libros fantasía, novelas IA, editorial digital, ebooks fantasía',
  openGraph: {
    title: 'Catálogo de libros | AtomoVisión',
    description: 'Explora nuestro catálogo completo de libros de ciencia ficción y fantasía generados por IA.',
    url: 'https://www.atomovision.es/catalog',
  },
  alternates: {
    canonical: 'https://www.atomovision.es/catalog',
  },
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
