import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import clientPromise from '@/lib/mongodb/client'
import Book from '@/lib/mongodb/models/Book'
import Rating from '@/lib/mongodb/models/Rating'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await clientPromise
    
    const { rating } = await request.json()
    
    // Validar rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating debe estar entre 1 y 5' },
        { status: 400 }
      )
    }
    
    // Obtener IP del usuario como identificador
    const headersList = headers()
    const forwarded = headersList.get('x-forwarded-for')
    const identifier = forwarded ? forwarded.split(',')[0] : 
                      headersList.get('x-real-ip') || 
                      'anonymous'
    
    // Buscar el libro
    const book = await Book.findById(params.id)
    if (!book) {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      )
    }
    
    // Intentar crear o actualizar el rating
    try {
      // Buscar si ya existe un rating de este usuario
      const existingRating = await Rating.findOne({
        bookId: params.id,
        identifier: identifier
      })
      
      let oldRating = 0
      let isNewRating = true
      
      if (existingRating) {
        oldRating = existingRating.rating
        existingRating.rating = rating
        await existingRating.save()
        isNewRating = false
      } else {
        await Rating.create({
          bookId: params.id,
          identifier: identifier,
          rating: rating
        })
      }
      
      // Actualizar estadísticas del libro
      if (isNewRating) {
        // Nuevo voto
        const newTotal = book.stats.totalRatings + 1
        const newAverage = ((book.stats.rating * book.stats.totalRatings) + rating) / newTotal
        
        book.stats.rating = Math.round(newAverage * 10) / 10 // Redondear a 1 decimal
        book.stats.totalRatings = newTotal
      } else {
        // Actualización de voto existente
        const sumWithoutOld = (book.stats.rating * book.stats.totalRatings) - oldRating
        const newAverage = (sumWithoutOld + rating) / book.stats.totalRatings
        
        book.stats.rating = Math.round(newAverage * 10) / 10
      }
      
      await book.save()
      
      return NextResponse.json({
        success: true,
        rating: book.stats.rating,
        totalRatings: book.stats.totalRatings,
        userRating: rating,
        message: isNewRating ? 'Voto registrado' : 'Voto actualizado'
      })
      
    } catch (error: any) {
      if (error.code === 11000) {
        // Este error no debería ocurrir con la lógica actual
        return NextResponse.json(
          { error: 'Ya has votado este libro' },
          { status: 400 }
        )
      }
      throw error
    }
    
  } catch (error) {
    console.error('Error al procesar rating:', error)
    return NextResponse.json(
      { error: 'Error al procesar el voto' },
      { status: 500 }
    )
  }
}

// GET para verificar si el usuario ya votó
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await clientPromise
    
    // Obtener IP del usuario
    const headersList = headers()
    const forwarded = headersList.get('x-forwarded-for')
    const identifier = forwarded ? forwarded.split(',')[0] : 
                      headersList.get('x-real-ip') || 
                      'anonymous'
    
    // Buscar rating existente
    const rating = await Rating.findOne({
      bookId: params.id,
      identifier: identifier
    })
    
    if (rating) {
      return NextResponse.json({
        hasRated: true,
        userRating: rating.rating
      })
    } else {
      return NextResponse.json({
        hasRated: false,
        userRating: null
      })
    }
    
  } catch (error) {
    console.error('Error al verificar rating:', error)
    return NextResponse.json(
      { error: 'Error al verificar el voto' },
      { status: 500 }
    )
  }
}
