import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    
    const purchase = await Purchase
      .findById(params.id)
      .populate({
        path: 'items.book',
        populate: {
          path: 'genre',
          select: 'name icon color'
        }
      })
      .lean()
    
    if (!purchase) {
      return NextResponse.json(
        {
          success: false,
          error: 'Venta no encontrada'
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: purchase
    })
    
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
