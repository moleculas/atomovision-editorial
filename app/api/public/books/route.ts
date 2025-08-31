import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Book from '@/lib/mongodb/models/Book'
import Genre from '@/lib/mongodb/models/Genre'

// Aumentar timeout para evitar problemas de carga
export const maxDuration = 30 // segundos

export async function GET(request: NextRequest) {
  try {
    // Intentar conectar con reintentos
    let connected = false
    let retries = 3
    
    while (!connected && retries > 0) {
      try {
        await connectMongoose()
        connected = true
      } catch (error) {
        console.error(`Error conectando a MongoDB, reintento ${4 - retries}/3:`, error)
        retries--
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    }
    
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos')
    }
    
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured')
    const genre = searchParams.get('genre')  // Cambiar de category a genre
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit
    
    const query: any = { status: 'published' }
    
    // Filtro por destacados
    if (featured === 'true') {
      query.featured = true
    }
    
    // Filtro por género
    if (genre) {
      const genreDoc = await Genre.findOne({ code: genre }).lean()  // Buscar por code
      if (genreDoc) {
        query.genre = (genreDoc as any)._id
      }
    }
    
    // Búsqueda
    if (search) {
      const searchRegex = new RegExp(search, 'i')
      query.$or = [
        { title: searchRegex },
        { 'authors.name': searchRegex }
      ]
    }
    
    // Obtener total de documentos que coinciden con el filtro
    const total = await Book.countDocuments(query)
    console.log('Total de libros que coinciden con filtros:', total)
    
    // Obtener libros con paginación
    const books = await Book.find(query)
      .populate('genre')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    console.log(`API /api/public/books - Página ${page}, mostrando ${books.length} de ${total} libros`)
    
    // Si no hay libros, verificar si hay en la BD sin filtros
    if (books.length === 0) {
      const totalBooks = await Book.countDocuments()
      console.log('Total de libros en BD (sin filtros):', totalBooks)
      const draftBooks = await Book.countDocuments({ status: 'draft' })
      console.log('Libros en borrador:', draftBooks)
    }
    
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
    
    // Transformar los datos para el frontend
    const transformedBooks = books.map((book: any) => ({
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
      inventory: 100, // Por ahora siempre disponible
      sku: book.registroAtomoVision || '',
      publicationDate: book.publishedAt || book.createdAt,
      language: book.language || 'es',
      pageCount: book.pageCount || 0,
      featured: book.featured || false,
      rating: book.stats?.rating || undefined,
      totalRatings: book.stats?.totalRatings || 0,
      epubFile: buildFileUrl(book.formats?.epub?.fileUrl, 'epubs'),
      preview: book.excerpt,
    }))
    // Calcular páginas totales
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      success: true,
      data: transformedBooks,
      count: transformedBooks.length,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
    
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener los libros',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
