import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Genre from '@/lib/mongodb/models/Genre'

/**
 * GET /api/genres
 * Obtener todos los géneros
 */
export async function GET(request: NextRequest) {
  try {
    await connectMongoose()
    
    // Obtener parámetros de query
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const parent = searchParams.get('parent')
    const sort = searchParams.get('sort') || 'order'
    
    // Construir filtro
    const filter: any = {}
    if (featured === 'true') filter.featured = true
    if (parent) filter.parentGenre = parent
    
    // Obtener géneros
    const genres = await Genre
      .find(filter)
      .sort(sort === 'name' ? { name: 1 } : { order: 1 })
      .lean()
    
    return NextResponse.json({
      success: true,
      count: genres.length,
      data: genres
    })
    
  } catch (error) {
    console.error('Error al obtener géneros:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los géneros'
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/genres
 * Crear un nuevo género (solo admin)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Verificar autenticación y rol de admin
    
    await connectMongoose()
    
    const body = await request.json()
    
    // Validación básica
    if (!body.name || !body.code) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nombre y código son requeridos'
        },
        { status: 400 }
      )
    }
    
    // Crear género
    const genre = await Genre.create(body)
    
    return NextResponse.json({
      success: true,
      data: genre
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Error al crear género:', error)
    
    // Error de duplicado
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya existe un género con ese código'
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear el género'
      },
      { status: 500 }
    )
  }
}
