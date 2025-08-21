import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'
import Book from '@/lib/mongodb/models/Book'
import { sendPurchaseEmail } from '@/lib/email/purchase-email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    await connectMongoose()

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Actualizar el estado de la compra
        const purchase = await Purchase.findOne({ 
          stripeSessionId: session.id 
        }).populate('items.book')

        if (!purchase) {
          console.error('Compra no encontrada para sesión:', session.id)
          return NextResponse.json(
            { error: 'Compra no encontrada' },
            { status: 404 }
          )
        }

        // Actualizar estado y payment intent
        purchase.status = 'completed'
        purchase.stripePaymentIntentId = session.payment_intent as string
        await purchase.save()

        // Incrementar ventas de cada libro
        for (const item of purchase.items) {
          await Book.findByIdAndUpdate(item.book._id, {
            $inc: { salesCount: item.quantity }
          })
        }

        // Enviar email con enlaces de descarga
        try {
          await sendPurchaseEmail(purchase)
        } catch (emailError) {
          console.error('Error enviando email:', emailError)
          // No fallar el webhook si el email falla
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Marcar la compra como fallida
        await Purchase.findOneAndUpdate(
          { stripeSessionId: session.id },
          { status: 'failed' }
        )
        
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Marcar la compra como fallida
        await Purchase.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { status: 'failed' }
        )
        
        break
      }

      default:
        console.log(`Evento no manejado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    )
  }
}

// Configurar el route handler para recibir el body raw
export const runtime = 'nodejs'
