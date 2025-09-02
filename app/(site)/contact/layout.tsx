import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consulta al Bibliotecario - Contacto',
  description: 'Contacta con el Bibliotecario de AtomoVisión. Resolvemos tus dudas sobre nuestro catálogo de libros de ciencia ficción y fantasía generados por IA.',
  keywords: 'contacto editorial, bibliotecario AtomoVisión, consultas libros, atención cliente editorial',
  openGraph: {
    title: 'Consulta al Bibliotecario | AtomoVisión',
    description: 'Contacta con el Bibliotecario de AtomoVisión para resolver tus dudas sobre nuestro catálogo.',
    url: 'https://www.atomovision.es/contact',
  },
  alternates: {
    canonical: 'https://www.atomovision.es/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
