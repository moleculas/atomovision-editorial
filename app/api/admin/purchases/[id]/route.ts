import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'
import { ensureModelsAreRegistered } from '@/lib/mongodb/ensure-models'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    ensureModelsAreRegistered() // Asegurar que todos los modelos estén registrados
    
    // Primero intentar sin populate
    let purchase = null
    try {
      purchase = await Purchase
        .findById(params.id)
        .lean()
    } catch (findError) {
      console.error('Error en findById:', findError)
    }
    
    if (!purchase) {
      return NextResponse.json(
        {
          success: false,
          error: 'Venta no encontrada'
        },
        { status: 404 }
      )
    }
    
    // Intentar populate
    try {
      const purchaseWithPopulate = await Purchase
        .findById(params.id)
        .populate({
          path: 'items.book',
          populate: {
            path: 'genre',
            select: 'name icon color'
          }
        })
        .lean()
      
      return NextResponse.json({
        success: true,
        data: purchaseWithPopulate
      })
    } catch (populateError) {
      console.error('Error en populate:', populateError)
      // Si falla el populate, devolver sin populate
      return NextResponse.json({
        success: true,
        data: purchase
      })
    }
    
  } catch (error) {
    console.error('Error al obtener venta:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener la venta'
      },
      { status: 500 }
    )
  }
}
