import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Book from '@/lib/mongodb/models/Book'
import Genre from '@/lib/mongodb/models/Genre'
import { generateSlug } from '@/lib/utils/slugify'

/**
 * GET /api/books/[id]
 * Obtener un libro por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoose()
    
    const book = await Book
      .findById(params.id)
      .lean() as any
    
    // SIEMPRE hacer populate manual del género
    if (book && book.genre) {
      // Intentar diferentes formas de buscar el género
      let genre = null
      
      // Manejar diferentes formatos de ObjectId
      let genreId = book.genre
      
      // Si es un objeto con $oid (formato JSON extendido de MongoDB)
      if (book.genre && book.genre.$oid) {
        genreId = book.genre.$oid
      }
      // Si es un ObjectId con método toString
      else if (book.genre && book.genre.toString && typeof book.genre.toString === 'function') {
        genreId = book.genre.toString()
      }
      // Si es un objeto con _id
      else if (book.genre && book.genre._id) {
        genreId = book.genre._id
      }
      
      try {
        // Intento 1: Por ID directo
        genre = await Genre.findById(genreId).lean()
        
        // Si no se encuentra, intentar con _id
        if (!genre) {
          genre = await Genre.findOne({ _id: genreId }).lean()
        }
        
        // Asignar el género encontrado
        if (genre) {
          book.genre = genre
        }
      } catch (genreError) {
        // Silenciar error
      }
    }
    
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: 'Libro no encontrado'
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: book
    })
    
  } catch (error) {
    console.error('Error al obtener libro:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener el libro'
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/books/[id]
 * Actualizar un libro
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Verificar que el libro existe
    const existingBook = await Book.findById(params.id)
    if (!existingBook) {
      return NextResponse.json(
        {
          success: false,
          error: 'Libro no encontrado'
        },
        { status: 404 }
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
    
    // Si cambió el título, generar nuevo slug
    if (body.title !== existingBook.title && !body.slug) {
      body.slug = generateSlug(body.title)
      
      // Asegurar que el slug sea único
      let slugExists = await Book.findOne({ 
        slug: body.slug,
        _id: { $ne: params.id }
      })
      let counter = 1
      while (slugExists) {
        body.slug = `${generateSlug(body.title)}-${counter}`
        slugExists = await Book.findOne({ 
          slug: body.slug,
          _id: { $ne: params.id }
        })
        counter++
      }
    }
    
    // Si cambió el género, actualizar contadores
    if (body.genre !== existingBook.genre.toString()) {
      // Decrementar contador del género anterior
      const oldGenre = await Genre.findById(existingBook.genre)
      if (oldGenre) {
        await oldGenre.decrementBookCount()
      }
      
      // Incrementar contador del nuevo género
      await genreExists.incrementBookCount()
    }
    
    // Actualizar libro
    const updatedBook = await Book
      .findByIdAndUpdate(
        params.id,
        {
          ...body,
          updatedAt: new Date()
        },
        { 
          new: true, 
          runValidators: true 
        }
      )
      .populate('genre', 'name code color icon')
    
    return NextResponse.json({
      success: true,
      data: updatedBook
    })
    
  } catch (error: any) {
    console.error('Error al actualizar libro:', error)
    
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
        error: 'Error al actualizar el libro'
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/books/[id]
 * Eliminar un libro
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Verificar autenticación y rol de admin
    
    await connectMongoose()
    
    const book = await Book.findById(params.id)
    
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: 'Libro no encontrado'
        },
        { status: 404 }
      )
    }
    
    // Decrementar contador del género
    const genre = await Genre.findById(book.genre)
    if (genre) {
      await genre.decrementBookCount()
    }
    
    // Eliminar libro
    await Book.findByIdAndDelete(params.id)
    
    return NextResponse.json({
      success: true,
      message: 'Libro eliminado correctamente'
    })
    
  } catch (error) {
    console.error('Error al eliminar libro:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar el libro'
      },
      { status: 500 }
    )
  }
}
