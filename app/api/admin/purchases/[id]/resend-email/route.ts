import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'
import { sendPurchaseEmail } from '@/lib/email/purchase-email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    
    const purchase = await Purchase
      .findById(params.id)
      .populate('items.book')
      .lean() as any
    
    if (!purchase) {
      return NextResponse.json(
        {
          success: false,
          error: 'Venta no encontrada'
        },
        { status: 404 }
      )
    }
    
    if (purchase.status !== 'completed') {
      return NextResponse.json(
        {
          success: false,
          error: 'Solo se pueden reenviar emails de ventas completadas'
        },
        { status: 400 }
      )
    }
    
    // Reenviar email
    try {
      await sendPurchaseEmail(purchase as any)
      
      return NextResponse.json({
        success: true,
        message: 'Email reenviado exitosamente'
      })
    } catch (emailError) {
      console.error('Error enviando email:', emailError)
      return NextResponse.json(
        {
          success: false,
          error: 'Error al enviar el email'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Error al reenviar email:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al procesar la solicitud'
      },
      { status: 500 }
    )
  }
}
