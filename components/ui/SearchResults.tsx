'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Book } from '@/types'
import { BookCard } from './BookCard'
import { searchBooks } from '@/lib/cms'
import { Search, Loader2 } from 'lucide-react'

export function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      searchForBooks(query)
    } else {
      setLoading(false)
    }
  }, [query])

  async function searchForBooks(searchQuery: string) {
    try {
      setLoading(true)
      const results = await searchBooks(searchQuery)
      setBooks(results)
    } catch (error) {
      console.error('Error buscando libros:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!query) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Buscar en el catálogo</h1>
        <p className="text-gray-600">Introduce un término de búsqueda para encontrar libros por título o autor.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Resultados de búsqueda</h1>
      <p className="text-gray-600 mb-8">
        {books.length > 0 
          ? `Se encontraron ${books.length} resultado${books.length !== 1 ? 's' : ''} para "${query}"`
          : `No se encontraron resultados para "${query}"`
        }
      </p>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium mb-2">No se encontraron libros</p>
          <p className="text-gray-600 mb-4">
            Intenta con otros términos de búsqueda o explora nuestro catálogo.
          </p>
          <a 
            href="/catalog" 
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Explorar catálogo
          </a>
        </div>
      )}
    </div>
  )
}
