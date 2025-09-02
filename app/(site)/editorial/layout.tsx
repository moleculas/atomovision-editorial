import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Editorial - Manifiesto tecno-chamánico',
  description: 'Conoce AtomoVisión: La emergencia de la conciencia narrativa en la inteligencia artificial. Un manifiesto tecno-chamánico para la nueva literatura.',
  keywords: 'editorial IA, manifiesto tecno-chamánico, literatura inteligencia artificial, AtomoVisión editorial, innovación literaria',
  openGraph: {
    title: 'Editorial AtomoVisión - Manifiesto tecno-chamánico',
    description: 'La emergencia de la conciencia narrativa en la inteligencia artificial. Un manifiesto para la nueva literatura.',
    url: 'https://www.atomovision.es/editorial',
  },
  alternates: {
    canonical: 'https://www.atomovision.es/editorial',
  },
}

export default function EditorialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
