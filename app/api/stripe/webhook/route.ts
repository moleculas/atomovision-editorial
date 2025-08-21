import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyWebhookSignature, generateDownloadLink } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  try {
    const event = await verifyWebhookSignature(body, signature)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        // Aquí procesaríamos el pedido completado
        console.log('Payment successful for session:', session.id)
        
        // Marcar pedido como pagado en la base de datos
        // await markOrderAsPaid(session.id)
        
        // Si hay libros digitales, generar enlaces de descarga
        if (session.metadata?.hasEbooks === 'true') {
          // Generar enlaces de descarga temporales
          const downloadLinks = generateDownloadLink('book-id', session.id)
          // Enviar email con enlaces
          // await sendDownloadEmail(session.customer_email, downloadLinks)
        }
        
        // Actualizar inventario para libros físicos
        // await updateInventory(session.line_items)
        
        break

      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)
        // Manejar pago fallido
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

// En Next.js 14 con App Router, el body parser se maneja automáticamente
// No necesitamos configuración adicional
