import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Book from '@/lib/mongodb/models/Book'
import Genre from '@/lib/mongodb/models/Genre'

export async function GET(request: NextRequest) {
  try {
    console.log('API /api/public/books - Iniciando')
    
    await connectMongoose()
    console.log('API /api/public/books - MongoDB conectado')
    
    const searchParams = request.nextUrl.searchParams
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '0')
    
    let query: any = { status: 'published' }
    
    // Filtro por destacados
    if (featured === 'true') {
      query.featured = true
    }
    
    // Filtro por categoría
    if (category) {
      const genre = await Genre.findOne({ name: category }).lean()
      if (genre) {
        query.genre = genre._id
      }
    }
    
    // Búsqueda
    if (search) {
      const searchRegex = new RegExp(search, 'i')
      query.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { synopsis: searchRegex },
        { 'authors.name': searchRegex },
        { 'seo.keywords': searchRegex }
      ]
    }
    
    let queryBuilder = Book.find(query)
      .populate('genre')
      .sort({ publishedAt: -1, createdAt: -1 })
    
    if (limit > 0) {
      queryBuilder = queryBuilder.limit(limit)
    }
    
    const books = await queryBuilder.lean()
    console.log('API /api/public/books - Libros encontrados:', books.length)
    
    // Si no hay libros, verificar si hay en la BD sin filtros
    if (books.length === 0) {
      const totalBooks = await Book.countDocuments()
      console.log('Total de libros en BD (sin filtros):', totalBooks)
      const draftBooks = await Book.countDocuments({ status: 'draft' })
      console.log('Libros en borrador:', draftBooks)
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
      themes: book.seo?.keywords || [],
      coverImage: book.cover?.original || '/textures/book-cover-1.jpg',
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
      epubFile: book.formats?.epub?.fileUrl,
      preview: book.excerpt,
    }))
    
    return NextResponse.json({
      success: true,
      data: transformedBooks,
      count: transformedBooks.length
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
