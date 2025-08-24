'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Package } from 'lucide-react'
import { useCartStore } from '@/lib/store'

interface OrderDetails {
  orderNumber: string
  email: string
  hasEbooks: boolean
  hasPhysicalBooks: boolean
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Limpiar el carrito después de una compra exitosa
    clearCart()

    // En producción, aquí cargaríamos los detalles del pedido
    // usando el sessionId
    setTimeout(() => {
      setOrderDetails({
        orderNumber: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        email: 'cliente@ejemplo.com',
        hasEbooks: true,
        hasPhysicalBooks: true,
      })
      setLoading(false)
    }, 1000)
  }, [clearCart])

  if (loading || !orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4">Procesando tu pedido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-playfair mb-4">¡Gracias por tu compra!</h1>
          <p className="text-lg text-muted-foreground">
            Tu pedido ha sido procesado exitosamente
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Detalles del pedido</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Número de pedido:</span>{' '}
              {orderDetails.orderNumber}
            </p>
            <p>
              <span className="font-medium">Email de confirmación:</span>{' '}
              {orderDetails.email}
            </p>
          </div>
        </div>

        {/* Sección para e-books */}
        {orderDetails.hasEbooks && (
          <div className="bg-card rounded-lg p-6 shadow mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Tus e-books están listos</h2>
            </div>
            <p className="mb-4 text-muted-foreground">
              Hemos enviado los enlaces de descarga a tu correo electrónico. Los enlaces
              estarán disponibles durante 7 días.
            </p>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Ver mis descargas
            </button>
          </div>
        )}

        {/* Sección para libros físicos */}
        {orderDetails.hasPhysicalBooks && (
          <div className="bg-card rounded-lg p-6 shadow mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Envío en proceso</h2>
            </div>
            <p className="mb-4 text-muted-foreground">
              Tus libros físicos serán enviados en las próximas 24-48 horas. Recibirás
              un email con el número de seguimiento cuando tu pedido sea despachado.
            </p>
            <div className="bg-accent/50 rounded p-3 text-sm">
              <p className="font-medium mb-1">Dirección de envío:</p>
              <p>Calle Ejemplo 123</p>
              <p>28001 Madrid, España</p>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalog"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center"
          >
            Seguir comprando
          </Link>
          <Link
            href="/account/orders"
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors text-center"
          >
            Ver mis pedidos
          </Link>
        </div>

        {/* Información adicional */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Si tienes alguna pregunta sobre tu pedido, no dudes en{' '}
            <Link href="/contact" className="text-primary hover:underline">
              contactarnos
            </Link>
          </p>
          <p className="mt-2">
            También puedes revisar el estado de tu pedido en cualquier momento desde tu cuenta.
          </p>
        </div>
      </div>
    </div>
  )
}
