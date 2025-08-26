'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { getBooksWithPagination } from '@/lib/cms'
import { getGenres } from '@/lib/services/genre.service'
import { Book } from '@/types'
import { BookCard } from './BookCard'
import { Pagination } from './Pagination'
import { Grid, List, ChevronDown } from 'lucide-react'

export function CatalogView2D() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [genres, setGenres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('releaseDate')
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 12

  useEffect(() => {
    loadData()
  }, [currentPage, selectedGenre])
  
  async function loadData() {
    try {
      setLoading(true)
      
      // Cargar géneros solo la primera vez
      if (genres.length === 0) {
        const genresData = await getGenres()
        setGenres(genresData)
      }
      
      // Construir filtros
      const filters: any = {}
      if (selectedGenre) {
        filters.genre = selectedGenre
      }
      
      // Cargar libros con paginación
      const result = await getBooksWithPagination(currentPage, itemsPerPage, filters)
      
      setBooks(result.books)
      setPagination(result.pagination)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGenreDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // No necesitamos paginar localmente porque ya viene paginado del servidor
  const paginatedBooks = books
  
  // Ordenar libros
  const sortedBooks = [...books].sort((a, b) => {
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
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleGenreChange = (genre: string | null) => {
    setSelectedGenre(genre)
    setCurrentPage(1)
    setShowGenreDropdown(false)
  }

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
            Explora nuestra colección completa de libros de ciencia ficción y fantasía
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedGenre
                    ? 'bg-primary text-white'
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                {selectedGenre ? genres.find(g => g.code === selectedGenre)?.name || 'Género' : 'Género'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showGenreDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showGenreDropdown && (
                <div className="absolute top-full mt-2 w-64 max-h-96 overflow-y-auto bg-card rounded-lg shadow-lg border z-50">
                  <button
                    onClick={() => handleGenreChange(null)}
                    className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm"
                  >
                    Todos los géneros
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre.id || genre._id}
                      onClick={() => handleGenreChange(genre.code)}
                      className="w-full text-left px-4 py-2 hover:bg-accent transition-colors flex items-center gap-2 text-sm"
                    >
                      {genre.icon && <span>{genre.icon}</span>}
                      <span>{genre.name}</span>
                      {genre.bookCount > 0 && (
                        <span className="ml-auto text-xs text-muted-foreground">({genre.bookCount})</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
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

        {/* Resultados */}
        <div className="mb-4 text-sm text-muted-foreground">
          Mostrando {paginatedBooks.length} de {pagination.total} libros
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
        
        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalItems={pagination.total}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
