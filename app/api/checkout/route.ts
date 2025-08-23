import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'
import Book from '@/lib/mongodb/models/Book'
import crypto from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  console.log('=== CHECKOUT API INICIADO ===')
  
  try {
    const body = await request.json()
    console.log('1. Body recibido:', JSON.stringify(body, null, 2))
    
    const { email, name, items } = body

    if (!email || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Email y productos son requeridos' },
        { status: 400 }
      )
    }

    console.log('2. Conectando a MongoDB...')
    await connectMongoose()
    console.log('3. MongoDB conectado')

    // Obtener información de los libros
    const bookIds = items.map((item: any) => item.bookId)
    console.log('4. IDs de libros a buscar:', bookIds)
    
    const books = await Book.find({ _id: { $in: bookIds } })
    console.log('5. Libros encontrados:', books.length)
    console.log('6. Detalles libros:', books.map(b => ({ id: b._id, title: b.title, price: b.pricing?.base })))

    if (books.length !== items.length) {
      return NextResponse.json(
        { error: 'Algunos libros no se encontraron' },
        { status: 404 }
      )
    }

    // Crear line items para Stripe
    console.log('7. Creando line items para Stripe...')
    const lineItems = items.map((item: any) => {
      const book = books.find(b => b._id.toString() === item.bookId)
      const price = book?.pricing?.base || 0
      if (!book) throw new Error('Libro no encontrado')
      
      // Validar que el libro tenga precio
      if (!book.pricing?.base) {
        throw new Error(`El libro ${book.title} no tiene precio definido`)
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: book.title,
            description: `${book.subtitle || 'Libro digital'} - Formato: ${item.format === 'ebook' ? 'eBook' : 'Tapa blanda'}`,
            metadata: {
              bookId: book._id.toString(),
              format: item.format,
            },
          },
          unit_amount: book.pricing.base, // Ya está en centavos
        },
        quantity: item.quantity,
      }
    })
    console.log('8. Line items creados:', JSON.stringify(lineItems, null, 2))

    // Generar token de descarga
    const downloadToken = crypto.randomBytes(32).toString('hex')

    // Crear registro de compra en estado pendiente
    const purchase = await Purchase.create({
      email,
      customerName: name || 'Cliente',
      items: items.map((item: any) => {
        const book = books.find(b => b._id.toString() === item.bookId)
        const price = book?.pricing?.base || 0
        return {
          book: item.bookId,
          format: item.format,
          quantity: item.quantity,
          price: price, // Ya está en centavos
        }
      }),
      totalAmount: items.reduce((total: number, item: any) => {
        const book = books.find(b => b._id.toString() === item.bookId)
        const price = book?.pricing?.base || 0
        return total + (price * item.quantity)
      }, 0),
      status: 'pending',
      downloadToken,
      downloadExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    })

    // Crear sesión de Stripe Checkout
    console.log('9. Creando sesión de Stripe...')
    console.log('10. STRIPE_SECRET_KEY existe:', !!process.env.STRIPE_SECRET_KEY)
    console.log('11. NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pago-cancelado`,
      metadata: {
        purchaseId: purchase._id.toString(),
        downloadToken,
      },
    })
    console.log('12. Sesión de Stripe creada:', session.id)

    // Actualizar la compra con el ID de sesión de Stripe
    purchase.stripeSessionId = session.id
    await purchase.save()

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('=== ERROR EN CHECKOUT ===')
    console.error('Tipo de error:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('Mensaje:', error instanceof Error ? error.message : 'Sin mensaje')
    console.error('Stack:', error instanceof Error ? error.stack : 'Sin stack')
    console.error('Error completo:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    )
  }
}
