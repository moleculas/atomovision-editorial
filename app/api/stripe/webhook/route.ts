import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'
import Book from '@/lib/mongodb/models/Book'
import { sendPurchaseEmail } from '@/lib/email/purchase-email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// IMPORTANTE: Este endpoint debe recibir el body RAW, no parseado
export async function POST(request: NextRequest) {
  try {
    // Obtener el body como texto
    const body = await request.text()
    
    // Obtener la firma del header
    const signature = headers().get('stripe-signature')
    
    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }
    
    // Verificar que tenemos el webhook secret
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret || webhookSecret === 'whsec_1234567890') {
      console.error('STRIPE_WEBHOOK_SECRET no está configurado correctamente')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }
    
    let event: Stripe.Event
    
    try {
      // Verificar la firma y construir el evento
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Error verificando webhook:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    // Conectar a MongoDB
    await connectMongoose()
    
    // Manejar el evento
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Buscar la compra por session ID
        const purchase = await Purchase.findOne({ 
          stripeSessionId: session.id 
        }).populate('items.book')
        
        if (!purchase) {
          return NextResponse.json(
            { error: 'Purchase not found' },
            { status: 404 }
          )
        }
        
        // Actualizar estado de la compra
        purchase.status = 'completed'
        purchase.stripePaymentIntentId = session.payment_intent as string
        await purchase.save()
        
        // Incrementar ventas de cada libro
        for (const item of purchase.items) {
          await Book.findByIdAndUpdate(item.book._id, {
            $inc: { 'stats.downloads': item.quantity }
          })
        }
        
        // Enviar email con enlaces de descarga
        try {
          await sendPurchaseEmail(purchase)
        } catch (emailError) {
          console.error('Error enviando email:', emailError)
          // No fallar el webhook por error de email
        }
        
        // Log final de éxito
        console.log(`Payment successful for session: ${session.id}`)
        
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
        // Evento no manejado
    }
    
    // Responder a Stripe que recibimos el webhook
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Error en webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Configurar el route para recibir webhooks
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
