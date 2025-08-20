import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import dbConnect from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID es requerido' },
        { status: 400 }
      )
    }

    // Obtener la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      )
    }

    await dbConnect()

    // Buscar la compra por el session ID
    const purchase = await Purchase.findOne({ stripeSessionId: sessionId })
      .populate('items.book', 'title subtitle')

    if (!purchase) {
      return NextResponse.json(
        { error: 'Compra no encontrada' },
        { status: 404 }
      )
    }

    // Preparar los detalles para el cliente
    const purchaseDetails = {
      email: purchase.email,
      items: purchase.items.map((item: any) => ({
        title: item.book.title,
        format: item.format === 'ebook' ? 'eBook' : 'Tapa blanda',
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: purchase.totalAmount,
      downloadToken: purchase.downloadToken,
    }

    return NextResponse.json(purchaseDetails)
  } catch (error) {
    console.error('Error verificando pago:', error)
    return NextResponse.json(
      { error: 'Error al verificar el pago' },
      { status: 500 }
    )
  }
}
