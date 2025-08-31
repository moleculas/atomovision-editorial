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
  try {
    const body = await request.json()
    
    const { email, name, items } = body

    if (!email || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Email y productos son requeridos' },
        { status: 400 }
      )
    }

    await connectMongoose()

    // Obtener información de los libros
    const bookIds = items.map((item: any) => item.bookId)
    
    const books = await Book.find({ _id: { $in: bookIds } })

    if (books.length !== items.length) {
      return NextResponse.json(
        { error: 'Algunos libros no se encontraron' },
        { status: 404 }
      )
    }

    // Crear line items para Stripe
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

    // Actualizar la compra con el ID de sesión de Stripe
    purchase.stripeSessionId = session.id
    await purchase.save()

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error en checkout:', error instanceof Error ? error.message : 'Error desconocido')
    
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    )
  }
}
