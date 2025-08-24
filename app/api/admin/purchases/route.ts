import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'

export async function GET(request: NextRequest) {
  console.log('[API PURCHASES] Iniciando GET /api/admin/purchases')
  
  try {
    // TODO: Verificar autenticación de admin
    
    console.log('[API PURCHASES] Conectando a MongoDB...')
    await connectMongoose()
    console.log('[API PURCHASES] Conectado a MongoDB')
    
    // Primero obtener las compras sin populate
    console.log('[API PURCHASES] Buscando compras...')
    const purchases = await Purchase
      .find({})
      .sort({ createdAt: -1 })
      .lean()
    
    console.log('[API PURCHASES] Compras encontradas:', purchases.length)
    
    // Si no hay compras, devolver array vacío
    if (!purchases || purchases.length === 0) {
      console.log('[API PURCHASES] No hay compras, devolviendo array vacío')
      return NextResponse.json({
        success: true,
        data: []
      })
    }
    
    // Intentar hacer populate manualmente con manejo de errores
    console.log('[API PURCHASES] Intentando populate de libros y géneros...')
    try {
      const purchasesWithBooks = await Purchase
        .find({})
        .populate({
          path: 'items.book',
          populate: {
            path: 'genre',
            select: 'name icon'
          }
        })
        .sort({ createdAt: -1 })
        .lean()
      
      console.log('[API PURCHASES] Populate exitoso, devolviendo', purchasesWithBooks.length, 'compras')
      return NextResponse.json({
        success: true,
        data: purchasesWithBooks || []
      })
    } catch (populateError) {
      console.error('[API PURCHASES] Error en populate:', populateError)
      console.log('[API PURCHASES] Devolviendo datos sin populate')
      // Si falla el populate, devolver las compras sin populate
      return NextResponse.json({
        success: true,
        data: purchases
      })
    }
    
  } catch (error) {
    console.error('Error al obtener ventas:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener las ventas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
