'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { OrderSummary } from './OrderSummary'
import { loadStripe } from '@stripe/stripe-js'
import { Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutForm() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validar email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'El email es obligatorio'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email no válido'
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (items.length === 0) {
      alert('Tu carrito está vacío')
      router.push('/catalog')
      return
    }

    setLoading(true)

    try {
      // Crear sesión de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          items: items.map(item => ({
            bookId: item.id,
            format: item.selectedFormat || 'ebook',
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Error al procesar el pedido')
      }

      const { sessionId } = await response.json()

      // Redirigir a Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Error al cargar Stripe')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl mb-4">Tu carrito está vacío</p>
        <button
          onClick={() => router.push('/catalog')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Explorar catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Formulario */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6">Información de contacto</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Te enviaremos el enlace de descarga a este email
              </p>
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nombre (opcional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Tu nombre"
              />
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 mr-2"
              />
              <label htmlFor="acceptTerms" className="text-sm">
                Acepto los{' '}
                <a href="/terminos" target="_blank" className="text-primary hover:underline">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="/privacidad" target="_blank" className="text-primary hover:underline">
                  política de privacidad
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
            )}

            {/* Información adicional */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Información importante:</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Los libros se enviarán al email proporcionado</li>
                <li>• Tendrás 7 días para descargar tu compra</li>
                <li>• Podrás descargar cada libro hasta 3 veces</li>
                <li>• Los libros no tienen DRM - puedes leerlos en cualquier dispositivo</li>
              </ul>
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Procesando...
                </>
              ) : (
                'Proceder al pago'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Resumen del pedido */}
      <div className="lg:col-span-1">
        <OrderSummary />
      </div>
    </div>
  )
}
