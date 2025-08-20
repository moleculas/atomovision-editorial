import { Metadata } from 'next'
import { SearchResults } from '@/components/ui/SearchResults'

export const metadata: Metadata = {
  title: 'Resultados de búsqueda | AtomoVisión',
  description: 'Encuentra los libros que buscas en nuestro catálogo',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <SearchResults />
      </div>
    </div>
  )
}
