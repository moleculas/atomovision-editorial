import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'

export async function GET(request: NextRequest) {
  try {
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    
    // Primero obtener las compras sin populate
    const purchases = await Purchase
      .find({})
      .sort({ createdAt: -1 })
      .lean()
    
    // Si no hay compras, devolver array vacío
    if (!purchases || purchases.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }
    
    // Intentar hacer populate manualmente con manejo de errores
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
      
      return NextResponse.json({
        success: true,
        data: purchasesWithBooks || []
      })
    } catch (populateError) {
      console.error('Error en populate, devolviendo datos sin populate:', populateError)
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
