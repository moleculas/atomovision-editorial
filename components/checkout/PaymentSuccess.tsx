'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Download, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'

interface PurchaseDetails {
  email: string
  items: Array<{
    title: string
    format: string
    quantity: number
    price: number
  }>
  totalAmount: number
  downloadToken: string
}

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  const [loading, setLoading] = useState(true)
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setError('No se encontró información de la sesión')
      setLoading(false)
      return
    }

    // Verificar el pago y obtener detalles
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        
        if (!response.ok) {
          throw new Error('Error al verificar el pago')
        }
        
        const data = await response.json()
        setPurchaseDetails(data)
        
        // Limpiar el carrito solo si el pago fue exitoso
        clearCart()
      } catch (err) {
        console.error('Error:', err)
        setError('Error al procesar tu pedido. Por favor, contacta con soporte.')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams, clearCart])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Hubo un problema</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Contactar soporte
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      {/* Icono de éxito */}
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>
      
      {/* Título */}
      <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>
      
      {/* Mensaje principal */}
      <p className="text-lg text-gray-600 mb-8">
        Gracias por tu compra. Hemos enviado los enlaces de descarga a tu email.
      </p>
      
      {/* Detalles del pedido */}
      {purchaseDetails && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left max-w-md mx-auto">
          <h2 className="font-semibold mb-3">Detalles del pedido:</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>Email: {purchaseDetails.email}</span>
            </div>
            
            <div className="pt-2 border-t">
              <p className="font-medium mb-1">Libros comprados:</p>
              {purchaseDetails.items.map((item, index) => (
                <div key={index} className="ml-4">
                  • {item.title} ({item.format}) x{item.quantity}
                </div>
              ))}
            </div>
            
            <div className="pt-2 border-t">
              <p className="font-medium">
                Total: {(purchaseDetails.totalAmount / 100).toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Instrucciones */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h3 className="font-semibold mb-3 flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Instrucciones de descarga
        </h3>
        <ul className="text-sm text-left max-w-md mx-auto space-y-2">
          <li>• Revisa tu email (incluida la carpeta de spam)</li>
          <li>• Encontrarás un enlace de descarga para cada libro</li>
          <li>• Los enlaces son válidos por 7 días</li>
          <li>• Puedes descargar cada libro hasta 3 veces</li>
          <li>• Los libros no tienen DRM y puedes leerlos en cualquier dispositivo</li>
        </ul>
      </div>
      
      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Volver al inicio
        </Link>
        
        <Link
          href="/catalogo"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Seguir explorando
        </Link>
      </div>
      
      {/* Ayuda */}
      <p className="text-sm text-gray-600 mt-8">
        ¿No has recibido el email?{' '}
        <Link href="/contact" className="text-primary hover:underline">
          Contáctanos
        </Link>
      </p>
    </div>
  )
}
