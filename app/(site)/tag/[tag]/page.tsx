'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BookCard } from '@/components/ui/BookCard'
import { Book } from '@/types'
import { ChevronLeft, Tag } from 'lucide-react'

export default function TagPage() {
  const params = useParams()
  const tag = decodeURIComponent(params.tag as string)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBooksByTag() {
      try {
        const response = await fetch(`/api/public/books-by-tag?tag=${encodeURIComponent(tag)}`)
        const data = await response.json()
        
        if (data.success) {
          // Transformar los libros al formato esperado por BookCard
          const transformedBooks = data.books.map((book: {
            id: string
            slug: string
            title: string
            subtitle?: string
            author: string
            synopsis: string
            category: string
            categorySlug: string
            tags: string[]
            themes?: string[]
            coverImage: string
            price: number
            currency: string
            formats: {
              ebook: boolean
              paperback: boolean
              hardcover: boolean
            }
            inventory: number
            sku: string
            publicationDate: string
            language: string
            pageCount: number
            featured: boolean
            rating?: number
            totalRatings: number
            epubFile?: string
            preview?: string
          }) => ({
            id: book.id,
            slug: book.slug,
            title: book.title,
            subtitle: book.subtitle,
            authors: [book.author],
            description_md: book.synopsis,
            categories: book.category ? [book.category] : [],
            tags: book.tags || [],
            coverImage: {
              url: book.coverImage,
              alt: `Portada de ${book.title}`,
              width: 400,
              height: 600,
            },
            gallery: [],
            price: book.price,
            currency: book.currency,
            formats: {
              ebook: book.formats?.ebook ? {
                fileUrl: book.epubFile || '',
                drm: false,
                pages: book.pageCount || 0,
              } : undefined,
              paperback: book.formats?.paperback ? {
                isbn: book.sku || '',
                weight: 400,
                dimensions: { width: 140, height: 210, depth: 30 },
              } : undefined,
              hardcover: book.formats?.hardcover ? {
                isbn: book.sku || '',
                weight: 600,
                dimensions: { width: 150, height: 220, depth: 35 },
              } : undefined,
            },
            inventory: book.inventory,
            sku: book.sku,
            stripeProductId: '',
            stripePriceId: '',
            releaseDate: book.publicationDate,
            language: book.language,
            samples: book.preview,
            featured: book.featured,
            rating: book.rating,
            totalRatings: book.totalRatings,
            pageCount: book.pageCount,
            metaTitle: '',
            metaDescription: '',
            ogImage: '',
          }))
          
          setBooks(transformedBooks)
        }
      } catch (error) {
        console.error('Error cargando libros por tag:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBooksByTag()
  }, [tag])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando libros...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="hover:text-primary">Inicio</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/catalog" className="hover:text-primary">Catálogo</Link>
            </li>
            <li>/</li>
            <li className="text-muted-foreground">Tag: {tag}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Libros etiquetados con: &ldquo;{tag}&rdquo;</h1>
          </div>
          <p className="text-muted-foreground">
            {books.length} {books.length === 1 ? 'libro encontrado' : 'libros encontrados'}
          </p>
        </div>

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-4">
              No se encontraron libros con la etiqueta &ldquo;{tag}&rdquo;
            </p>
            <Link 
              href="/catalog"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al catálogo
            </Link>
          </div>
        )}

        {/* Back to catalog */}
        {books.length > 0 && (
          <div className="mt-12 text-center">
            <Link 
              href="/catalog"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
