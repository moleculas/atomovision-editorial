// Sistema CMS simplificado que conecta con MongoDB mediante APIs
// Funciona tanto en cliente como servidor

import type { Book, Collection } from '@/types'

// Para componentes del servidor, necesitamos la URL completa
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Estamos en el servidor
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  }
  // Estamos en el cliente
  return ''
}

// Mantener compatibilidad con urlFor
export function urlFor(source: any) {
  return { url: () => source?.url || '/placeholder.jpg' }
}

// Convertir respuesta de API a tipo Book del frontend
function apiBookToType(book: any): Book {
  return {
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
        fileUrl: '', // Vacío - no exponemos URLs de archivos
        drm: false,
        pages: book.pages || 0,
      } : undefined,
      paperback: book.formats?.paperback ? {
        isbn: book.isbn || '',
        weight: 400,
        dimensions: { width: 140, height: 210, depth: 30 },
      } : undefined,
      hardcover: book.formats?.hardcover ? {
        isbn: book.isbn || '',
        weight: 600,
        dimensions: { width: 150, height: 220, depth: 35 },
      } : undefined,
    },
    inventory: book.inventory,
    sku: book.sku,
    stripeProductId: book.stripeProductId,
    stripePriceId: book.stripePriceId,
    releaseDate: book.publicationDate,
    language: book.language,
    samples: book.preview,
    featured: book.featured,
    rating: book.rating,
    totalRatings: book.totalRatings,
    pageCount: book.pageCount,
    metaTitle: book.metaTitle,
    metaDescription: book.metaDescription,
    ogImage: book.ogImage,
  }
}

export async function getBooks(): Promise<Book[]> {
  try {
    const response = await fetch(`${getApiUrl()}/api/public/books`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener los libros')
    }
    
    const { data } = await response.json()
    return data.map(apiBookToType)
  } catch (error) {
    console.error('Error fetching books:', error)
    return []
  }
}

export async function getBooksWithPagination(
  page: number = 1,
  limit: number = 12,
  filters?: {
    genre?: string
    featured?: boolean
    search?: string
  }
): Promise<{
  books: Book[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    
    if (filters?.genre) params.append('genre', filters.genre)
    if (filters?.featured) params.append('featured', 'true')
    if (filters?.search) params.append('search', filters.search)
    
    const response = await fetch(
      `${getApiUrl()}/api/public/books?${params.toString()}`,
      { cache: 'no-store' }
    )
    
    if (!response.ok) {
      throw new Error('Error al obtener los libros')
    }
    
    const result = await response.json()
    
    return {
      books: result.data.map(apiBookToType),
      pagination: {
        page: result.pagination?.page || page,
        limit: result.pagination?.limit || limit,
        total: result.pagination?.total || result.count || 0,
        totalPages: result.pagination?.totalPages || Math.ceil((result.count || 0) / limit),
        hasNext: result.pagination?.hasNext || false,
        hasPrev: result.pagination?.hasPrev || false,
      }
    }
  } catch (error) {
    console.error('Error fetching books with pagination:', error)
    return {
      books: [],
      pagination: {
        page: 1,
        limit: limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      }
    }
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  try {
    const response = await fetch(`${getApiUrl()}/api/public/books/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const { data } = await response.json()
    return apiBookToType(data)
  } catch (error) {
    console.error('Error fetching book by slug:', error)
    return null
  }
}

export async function getFeaturedBooks(): Promise<Book[]> {
  try {
    const response = await fetch(`${getApiUrl()}/api/public/books?featured=true&limit=6`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener los libros destacados')
    }
    
    const { data } = await response.json()
    return data.map(apiBookToType)
  } catch (error) {
    console.error('Error fetching featured books:', error)
    return []
  }
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  try {
    const response = await fetch(`${getApiUrl()}/api/public/books?category=${encodeURIComponent(category)}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener los libros por categoría')
    }
    
    const { data } = await response.json()
    return data.map(apiBookToType)
  } catch (error) {
    console.error('Error fetching books by category:', error)
    return []
  }
}

export async function searchBooks(query: string): Promise<Book[]> {
  try {
    const response = await fetch(`${getApiUrl()}/api/public/books?search=${encodeURIComponent(query)}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Error al buscar libros')
    }
    
    const { data } = await response.json()
    return data.map(apiBookToType)
  } catch (error) {
    console.error('Error searching books:', error)
    return []
  }
}

export async function getCollections(): Promise<Collection[]> {
  // TODO: Implementar colecciones desde MongoDB
  return []
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  // TODO: Implementar colecciones desde MongoDB
  return null
}
