import Stripe from 'stripe'
import { CheckoutSession } from '@/types'

// Solo crear el cliente de Stripe si está configurado
const stripe = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('test_51234567890')
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null

export async function createCheckoutSession(data: CheckoutSession) {
  if (!stripe) {
    console.warn('Stripe no está configurado. Retornando sesión mock.')
    return {
      sessionId: 'mock_session_' + Date.now(),
      url: '/checkout-mock' // En producción, esto redireccionaría a Stripe
    }
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: data.items.map(item => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      customer_email: data.customerEmail,
      metadata: {
        // Podemos añadir metadata personalizada aquí
      },
      shipping_address_collection: {
        allowed_countries: ['ES', 'FR', 'DE', 'IT', 'PT'], // Países de envío permitidos
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  if (!stripe) {
    throw new Error('Stripe no está configurado')
  }
  
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    return event
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw error
  }
}

export async function createProduct(book: {
  name: string
  description?: string
  images?: string[]
  metadata?: Record<string, string>
}) {
  if (!stripe) {
    return {
      id: 'mock_product_' + Date.now(),
      name: book.name,
      description: book.description,
      images: book.images,
      metadata: book.metadata,
    }
  }
  
  try {
    const product = await stripe.products.create({
      name: book.name,
      description: book.description,
      images: book.images,
      metadata: book.metadata,
    })
    return product
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export async function createPrice(data: {
  productId: string
  unitAmount: number
  currency: string
  metadata?: Record<string, string>
}) {
  if (!stripe) {
    return {
      id: 'mock_price_' + Date.now(),
      product: data.productId,
      unit_amount: data.unitAmount,
      currency: data.currency,
      metadata: data.metadata,
    }
  }
  
  try {
    const price = await stripe.prices.create({
      product: data.productId,
      unit_amount: data.unitAmount,
      currency: data.currency,
      metadata: data.metadata,
    })
    return price
  } catch (error) {
    console.error('Error creating price:', error)
    throw error
  }
}

export async function retrieveSession(sessionId: string) {
  if (!stripe) {
    return {
      id: sessionId,
      payment_status: 'unpaid',
      customer_email: 'test@example.com',
      line_items: { data: [] },
    }
  }
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    })
    return session
  } catch (error) {
    console.error('Error retrieving session:', error)
    throw error
  }
}

// Función para generar un enlace de descarga temporal (mock)
export function generateDownloadLink(bookId: string, sessionId: string): string {
  // En producción, esto generaría un enlace firmado temporal
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 horas
  const token = Buffer.from(`${bookId}:${sessionId}:${expiresAt}`).toString('base64')
  return `/api/download?token=${token}`
}

export { stripe }
