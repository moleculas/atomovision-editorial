import { Metadata } from 'next'
import Link from 'next/link'
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pago Cancelado | AtomoVisión',
  description: 'El proceso de pago ha sido cancelado',
}

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center">
          {/* Icono */}
          <div className="flex justify-center mb-6">
            <XCircle className="w-20 h-20 text-red-500" />
          </div>
          
          {/* Título */}
          <h1 className="text-3xl font-bold mb-4">Pago Cancelado</h1>
          
          {/* Mensaje */}
          <p className="text-lg text-gray-600 mb-8">
            Has cancelado el proceso de pago. No se ha realizado ningún cargo.
          </p>
          
          {/* Información adicional */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-sm text-gray-700 mb-2">
              Tu carrito sigue intacto. Puedes volver cuando quieras para completar tu compra.
            </p>
            <p className="text-sm text-gray-700">
              Si has tenido algún problema, no dudes en{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contactarnos
              </Link>
              .
            </p>
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <ShoppingCart className="w-5 h-5" />
              Volver al checkout
            </Link>
            
            <Link
              href="/catalogo"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Seguir explorando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
