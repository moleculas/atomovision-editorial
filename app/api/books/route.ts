import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Book from '@/lib/mongodb/models/Book'
import Genre from '@/lib/mongodb/models/Genre'
import { generateSlug } from '@/lib/utils/slugify'

/**
 * GET /api/books
 * Obtener libros con filtros
 */
export async function GET(request: NextRequest) {
  try {
    await connectMongoose()
    
    const { searchParams } = new URL(request.url)
    
    // Parámetros de filtrado
    const genre = searchParams.get('genre')
    const status = searchParams.get('status') || 'published'
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || '-publishedAt'
    
    // Paginación
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit
    
    // Construir filtro
    const filter: any = {}
    if (status !== 'all') filter.status = status
    if (genre) filter.genre = genre
    if (featured === 'true') filter.featured = true
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { synopsis: { $regex: search, $options: 'i' } },
        { 'authors.name': { $regex: search, $options: 'i' } }
      ]
    }
    
    // Obtener libros SIN populate
    const [books, total] = await Promise.all([
      Book
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments(filter)
    ])
    
    // Hacer populate manual de géneros
    const genreIds = [...new Set(books.map(book => book.genre).filter(Boolean))]
    const genres = await Genre.find({ _id: { $in: genreIds } }).lean()
    const genresMap = new Map(genres.map(g => [g._id.toString(), g]))
    
    // Asignar géneros a los libros
    const booksWithGenres = books.map(book => {
      if (book.genre && genresMap.has(book.genre.toString())) {
        return { ...book, genre: genresMap.get(book.genre.toString()) }
      }
      return book
    })
    
    // Calcular páginas
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      success: true,
      data: booksWithGenres,
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
    console.error('Error al obtener libros:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los libros'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/books
 * Crear un nuevo libro
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Verificar autenticación y rol de admin
    
    await connectMongoose()
    
    const body = await request.json()
    
    // Validación básica
    if (!body.title || !body.genre || !body.synopsis) {
      return NextResponse.json(
        {
          success: false,
          error: 'Título, género y sinopsis son requeridos'
        },
        { status: 400 }
      )
    }
    
    // Verificar que el género existe
    const genreExists = await Genre.findById(body.genre)
    if (!genreExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'El género especificado no existe'
        },
        { status: 400 }
      )
    }
    
    // Verificar que se proporciona el registro AtomoVision
    if (!body.registroAtomoVision) {
      return NextResponse.json(
        {
          success: false,
          error: 'El registro AtomoVision es obligatorio'
        },
        { status: 400 }
      )
    }
    
    // Generar slug si no se proporciona
    if (!body.slug) {
      body.slug = generateSlug(body.title)
      
      // Asegurar que el slug sea único
      let slugExists = await Book.findOne({ slug: body.slug })
      let counter = 1
      while (slugExists) {
        body.slug = `${generateSlug(body.title)}-${counter}`
        slugExists = await Book.findOne({ slug: body.slug })
        counter++
      }
    }
    
    // Establecer valores por defecto
    const bookData = {
      ...body,
      language: body.language || 'es',
      status: body.status || 'draft',
      featured: body.featured || false,
      stats: {
        views: 0,
        downloads: 0,
        rating: 0,
        reviews: 0
      }
    }
    
    // Crear libro
    const book = await Book.create(bookData)
    
    // Incrementar contador del género
    await genreExists.incrementBookCount()
    
    // Poblar el género antes de devolver
    await book.populate('genre', 'name code color')
    
    return NextResponse.json({
      success: true,
      data: book
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Error al crear libro:', error)
    
    // Error de duplicado
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        {
          success: false,
          error: `Ya existe un libro con ese ${field}`
        },
        { status: 400 }
      )
    }
    
    // Error de validación
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Error de validación',
          details: messages
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear el libro'
      },
      { status: 500 }
    )
  }
}
