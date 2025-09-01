import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Book from '@/lib/mongodb/models/Book'

// Función helper para construir URLs completas
const buildFileUrl = (path: string | undefined, type: 'epubs' | 'portadas'): string => {
  if (!path) return ''
  const filesBaseUrl = process.env.NEXT_PUBLIC_FILES_BASE_URL || 'https://anomaliagravitatoria.net/atomovision'
  
  // Si ya es una URL completa, devolverla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Si es una ruta local o solo el nombre del archivo
  if (path.startsWith('/')) {
    return `${filesBaseUrl}${path}`
  }
  
  return `${filesBaseUrl}/${path}`
}

function transformBookForFrontend(book: any) {
  return {
    id: book._id.toString(),
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle || undefined,
    author: book.authors?.[0]?.name || 'Autor desconocido',
    synopsis: book.synopsis,
    category: book.genre?.name || '',
    categorySlug: book.genre?.code || '',
    tags: book.tags || [],
    themes: book.seo?.keywords || [],
    coverImage: buildFileUrl(book.cover?.original, 'portadas') || '/textures/book-cover-1.jpg',
    price: book.pricing?.base || 0,
    currency: book.pricing?.currency || 'EUR',
    formats: {
      ebook: book.formats?.epub ? true : false,
      paperback: book.formats?.pdf ? true : false,
      hardcover: false
    },
    inventory: 100,
    sku: book.registroAtomoVision || '',
    publicationDate: book.publishedAt || book.createdAt,
    language: book.language || 'es',
    pageCount: book.pageCount || 0,
    featured: book.featured || false,
    rating: book.stats?.rating || undefined,
    totalRatings: book.stats?.totalRatings || 0,
    epubFile: buildFileUrl(book.formats?.epub?.fileUrl, 'epubs'),
    preview: book.excerpt,
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoose()

    // Obtener el tag de los query params
    const searchParams = request.nextUrl.searchParams
    const tag = searchParams.get('tag')

    if (!tag) {
      return NextResponse.json({
        success: false,
        error: 'Tag no especificado'
      }, { status: 400 })
    }

    // Buscar libros que contengan este tag
    const books = await Book.find({
      tags: { $in: [tag] },
      status: 'published'
    })
    .populate('genre')
    .sort({ publishedAt: -1 })
    .lean()

    // Transformar los libros para el frontend
    const transformedBooks = books.map(transformBookForFrontend)

    return NextResponse.json({
      success: true,
      books: transformedBooks,
      total: transformedBooks.length
    })

  } catch (error) {
    console.error('Error al buscar libros por tag:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al buscar libros'
    }, { status: 500 })
  }
}
