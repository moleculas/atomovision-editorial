'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBooksMock } from '@/lib/cms'
import { Book } from '@/types'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Eye } from 'lucide-react'

export function Fallback2D() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const addItem = useCartStore((state) => state.addItem)

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

  const filteredBooks = books.filter((book) => {
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
            Descubre nuestra colección de libros digitales y físicos
          </p>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'featured'
                  ? 'bg-primary text-white'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              Destacados
            </button>
            <button
              onClick={() => setFilter('Ficción')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'Ficción'
                  ? 'bg-primary text-white'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              Ficción
            </button>
            <button
              onClick={() => setFilter('Ensayo')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'Ensayo'
                  ? 'bg-primary text-white'
                  : 'bg-accent hover:bg-accent/80'
              }`}
            >
              Ensayo
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card bg-card rounded-lg overflow-hidden shadow-lg">
              {/* Book Cover */}
              <Link href={`/book/${book.slug}`} className="block relative aspect-[2/3] bg-accent">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <h3 className="font-playfair text-lg mb-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.authors.join(', ')}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm">Ver detalles</span>
                </div>
              </Link>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{book.authors.join(', ')}</p>
                
                {/* Price and Actions */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold">
                    {(book.price / 100).toFixed(2)} {book.currency}
                  </span>
                  <div className="flex gap-2">
                    <Link
                      href={`/book/${book.slug}`}
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
