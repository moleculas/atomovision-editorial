'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBooks } from '@/lib/cms'
import { getGenres } from '@/lib/services/genre.service'
import { Book } from '@/types'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Eye, Star, ChevronDown } from 'lucide-react'

export function Fallback2D() {
  const [books, setBooks] = useState<Book[]>([])
  const [genres, setGenres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [showGenreDropdown, setShowGenreDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function loadData() {
      try {
        const [booksData, genresData] = await Promise.all([
          getBooks(),
          getGenres()
        ])
        setBooks(booksData)
        setGenres(genresData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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

  const filteredBooks = books.filter((book) => {
    // Si hay un género seleccionado, filtrar por género
    if (selectedGenre) {
      return book.categories.includes(selectedGenre)
    }
    
    // Si no, aplicar los filtros normales
    if (filter === 'all') return true
    if (filter === 'featured') return book.featured
    return book.categories.includes(filter)
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
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-playfair mb-4">Catálogo Editorial</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Descubre nuestra colección de libros de ciencia ficción y fantasía
          </p>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => {
                setFilter('all')
                setSelectedGenre(null)
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' && !selectedGenre
                  ? 'bg-primary text-white'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => {
                setFilter('featured')
                setSelectedGenre(null)
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'featured' && !selectedGenre
                  ? 'bg-primary text-white'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              Destacados
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedGenre
                    ? 'bg-primary text-white'
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                {selectedGenre ? genres.find(g => g.name === selectedGenre)?.name || 'Género' : 'Género'}
                <ChevronDown className={`w-4 h-4 transition-transform ${showGenreDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showGenreDropdown && (
                <div className="absolute top-full mt-2 w-64 max-h-96 overflow-y-auto bg-card rounded-lg shadow-lg border z-50">
                  <button
                    onClick={() => {
                      setSelectedGenre(null)
                      setFilter('all')
                      setShowGenreDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm"
                  >
                    Todos los géneros
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre.id || genre._id}
                      onClick={() => {
                        setSelectedGenre(genre.name)
                        setFilter('all')
                        setShowGenreDropdown(false)
                      }}
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
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card bg-card rounded-lg overflow-hidden shadow-lg">
              {/* Book Cover */}
              <Link href={`/libro/${book.slug}`} className="block relative aspect-[2/3] bg-accent overflow-hidden">
                {book.coverImage?.url ? (
                  <img 
                    src={book.coverImage.url} 
                    alt={book.coverImage.alt || `Portada de ${book.title}`}
                    className="w-full h-full object-cover" style={{objectPosition: '95% center'}}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <h3 className="font-playfair text-lg mb-2">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.authors.join(', ')}</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm">Ver detalles</span>
                </div>
              </Link>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-1 text-lg ">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.authors.join(', ')}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{(Math.random() * 2 + 3).toFixed(1)}</span>
                </div>
                
                {/* Price and Actions */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold">
                    {(book.price / 100).toFixed(2)} {book.currency}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/libro/${book.slug}`}
                      className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                      aria-label="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        const format = book.formats.ebook ? 'ebook' : 'paperback'
                        addItem(book, format)
                      }}
                      className="p-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                      aria-label="Añadir al carrito"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Formats */}
                <div className="flex gap-2 mt-2">
                  {book.formats.ebook && (
                    <span className="text-xs bg-accent px-2 py-1 rounded">eBook</span>
                  )}
                  {book.formats.paperback && (
                    <span className="text-xs bg-accent px-2 py-1 rounded">Tapa blanda</span>
                  )}
                  {book.formats.hardcover && (
                    <span className="text-xs bg-accent px-2 py-1 rounded">Tapa dura</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No se encontraron libros con ese filtro.</p>
          </div>
        )}
      </div>
    </div>
  )
}
