// Este archivo conecta la aplicación pública con los datos reales mediante API
// NO importa MongoDB directamente - usa fetch para llamar a las APIs

import { Book as BookType } from '@/types'

// Función helper para construir URLs completas de archivos
const FILES_BASE_URL = process.env.NEXT_PUBLIC_FILES_BASE_URL || 'https://anomaliagravitatoria.net/atomovision/libros'

function buildFileUrl(path: string | undefined, type: 'epubs' | 'portadas'): string {
  if (!path) return ''
  
  // Si ya es una URL completa, devolverla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Si es una ruta local antigua, extraer solo el nombre del archivo
  if (path.startsWith('/libros/')) {
    const filename = path.split('/').pop() || ''
    return `${FILES_BASE_URL}/${type}/${filename}`
  }
  
  // Si es solo el nombre del archivo
  return `${FILES_BASE_URL}/${type}/${path}`
}

// Convertir respuesta de API a tipo Book del frontend
function apiBookToType(book: any): BookType {
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
      url: buildFileUrl(book.coverImage, 'portadas'),
      alt: `Portada de ${book.title}`,
      width: 400,
      height: 600,
    },
    gallery: [],
    price: book.price,
    currency: book.currency,
    formats: {
      ebook: book.formats?.ebook ? {
        fileUrl: buildFileUrl(book.epubFile, 'epubs'),
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

export async function getBooksFromDB(): Promise<BookType[]> {
  try {
    const response = await fetch('/api/public/books', {
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

export async function getBookBySlugFromDB(slug: string): Promise<BookType | null> {
  try {
    const response = await fetch(`/api/public/books/${slug}`, {
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

export async function getFeaturedBooksFromDB(): Promise<BookType[]> {
  try {
    const response = await fetch('/api/public/books?featured=true&limit=6', {
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

export async function getBooksByCategoryFromDB(categoryName: string): Promise<BookType[]> {
  try {
    const response = await fetch(`/api/public/books?category=${encodeURIComponent(categoryName)}`, {
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

export async function searchBooksInDB(query: string): Promise<BookType[]> {
  try {
    const response = await fetch(`/api/public/books?search=${encodeURIComponent(query)}`, {
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
