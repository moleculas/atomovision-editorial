'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { getBooks } from '@/lib/cms'
import { Book } from '@/types'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadBooks() {
      const data = await getBooks()
      setBooks(data)
    }
    loadBooks()
  }, [])

  const handleCheckout = async () => {
    setLoading(true)
    
    try {
      // Crear sesión de checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => {
            const book = books.find(b => b.id === item.bookId)
            return {
              priceId: book?.stripePriceId || 'price_mock',
              quantity: item.quantity,
            }
          }),
        }),
      })

      const { sessionId } = await response.json()
      
      // Redireccionar a Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Error:', error)
          alert('Error al procesar el pago')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la sesión de pago')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-playfair mb-4">Tu carrito está vacío</h1>
            <p className="text-muted-foreground mb-8">
              Explora nuestro catálogo y añade algunos libros
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Explorar catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = getTotalPrice()

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-playfair mb-8">Tu carrito</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const book = books.find(b => b.id === item.bookId)
              if (!book) return null

              return (
                <div key={`${item.bookId}-${item.format}`} className="bg-card rounded-lg p-4 shadow">
                  <div className="flex gap-4">
                    {/* Imagen del libro */}
                    <div className="w-24 h-36 bg-accent rounded flex items-center justify-center flex-shrink-0">
                      <div className="text-center p-2">
                        <p className="text-xs font-playfair">{book.title}</p>
                      </div>
                    </div>

                    {/* Información del libro */}
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{book.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {book.authors.join(', ')}
                      </p>
                      <p className="text-sm mb-3">
                        Formato: <span className="font-medium">
                          {item.format === 'ebook' ? 'eBook' : 
                           item.format === 'paperback' ? 'Tapa blanda' : 'Tapa dura'}
                        </span>
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.bookId, item.format, item.quantity - 1)}
                            className="p-1 hover:bg-accent rounded"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.bookId, item.format, item.quantity + 1)}
                            className="p-1 hover:bg-accent rounded"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Precio y eliminar */}
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            {((item.price * item.quantity) / 100).toFixed(2)} EUR
                          </span>
                          <button
                            onClick={() => removeItem(item.bookId, item.format)}
                            className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors"
                            aria-label="Eliminar del carrito"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{(totalPrice / 100).toFixed(2)} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>Calculado en checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>Incluidos</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{(totalPrice / 100).toFixed(2)} EUR</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Proceder al pago'}
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-2 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                Vaciar carrito
              </button>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Pago seguro con Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
