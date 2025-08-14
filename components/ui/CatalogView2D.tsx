'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getBooksMock } from '@/lib/cms'
import { Book } from '@/types'
import { BookCard } from './BookCard'
import { Filter, Grid, List } from 'lucide-react'

export function CatalogView2D() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('releaseDate')
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'all')
  const [filterFormat, setFilterFormat] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await getBooksMock()
        setBooks(data)
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBooks()
  }, [])

  // Filtrar libros
  const filteredBooks = books.filter((book) => {
    if (filterCategory !== 'all' && !book.categories.includes(filterCategory)) {
      return false
    }
    if (filterFormat !== 'all') {
      if (filterFormat === 'ebook' && !book.formats.ebook) return false
      if (filterFormat === 'paperback' && !book.formats.paperback) return false
      if (filterFormat === 'hardcover' && !book.formats.hardcover) return false
    }
    return true
  })

  // Ordenar libros
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'releaseDate':
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'price':
        return a.price - b.price
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4">Cargando catálogo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-playfair mb-4">Catálogo de libros</h1>
          <p className="text-lg text-muted-foreground">
            Explora nuestra colección completa de libros digitales y físicos
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-accent rounded-lg"
            >
              <option value="releaseDate">Más recientes</option>
              <option value="title">Título A-Z</option>
              <option value="price">Precio: menor a mayor</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-accent'}`}
              aria-label="Vista cuadrícula"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-accent'}`}
              aria-label="Vista lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="bg-card rounded-lg p-6 mb-6 shadow">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Categorías</h3>
                <div className="space-y-2">
                  {['all', 'Ficción', 'Ensayo', 'Poesía', 'Infantil'].map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filterCategory === category}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="text-primary"
                      />
                      <span>{category === 'all' ? 'Todas' : category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Formato</h3>
                <div className="space-y-2">
                  {['all', 'ebook', 'paperback', 'hardcover'].map((format) => (
                    <label key={format} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={filterFormat === format}
                        onChange={(e) => setFilterFormat(e.target.value)}
                        className="text-primary"
                      />
                      <span>
                        {format === 'all' ? 'Todos' :
                         format === 'ebook' ? 'eBook' :
                         format === 'paperback' ? 'Tapa blanda' : 'Tapa dura'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        <div className="mb-4 text-sm text-muted-foreground">
          Mostrando {sortedBooks.length} de {books.length} libros
        </div>

        {/* Grid/List de libros */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBooks.map((book) => (
              <BookCard key={book.id} book={book} viewMode="list" />
            ))}
          </div>
        )}

        {sortedBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No se encontraron libros con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
