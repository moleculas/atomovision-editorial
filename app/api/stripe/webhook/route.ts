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
  console.log('=== WEBHOOK STRIPE RECIBIDO ===')
  
  try {
    // Obtener el body como texto
    const body = await request.text()
    
    // Obtener la firma del header
    const signature = headers().get('stripe-signature')
    
    if (!signature) {
      console.error('No se encontró stripe-signature')
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
      console.log('Evento verificado:', event.type)
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
        console.log('Checkout completado:', session.id)
        
        // Buscar la compra por session ID
        const purchase = await Purchase.findOne({ 
          stripeSessionId: session.id 
        }).populate('items.book')
        
        if (!purchase) {
          console.error('Compra no encontrada para session:', session.id)
          return NextResponse.json(
            { error: 'Purchase not found' },
            { status: 404 }
          )
        }
        
        // Actualizar estado de la compra
        purchase.status = 'completed'
        purchase.stripePaymentIntentId = session.payment_intent as string
        await purchase.save()
        
        console.log('Compra actualizada:', purchase._id)
        
        // Incrementar ventas de cada libro
        console.log('Actualizando contadores de ventas...')
        for (const item of purchase.items) {
          await Book.findByIdAndUpdate(item.book._id, {
            $inc: { 'stats.downloads': item.quantity }
          })
          console.log(`Ventas actualizadas para libro ${item.book._id}`)
        }
        
        // Enviar email con enlaces de descarga
        try {
          console.log('Preparando envío de email...')
          await sendPurchaseEmail(purchase)
          console.log('Email enviado exitosamente a:', purchase.email)
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
        console.log('Sesión expirada:', session.id)
        
        // Marcar la compra como fallida
        await Purchase.findOneAndUpdate(
          { stripeSessionId: session.id },
          { status: 'failed' }
        )
        
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Pago fallido:', paymentIntent.id)
        
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
