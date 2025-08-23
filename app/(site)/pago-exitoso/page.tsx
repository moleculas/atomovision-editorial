import { Metadata } from 'next'
import { Suspense } from 'react'
import PaymentSuccess from '@/components/checkout/PaymentSuccess'

export const metadata: Metadata = {
  title: 'Pago Exitoso | AtomoVisión',
  description: 'Tu pedido se ha completado exitosamente',
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Suspense fallback={<div className="text-center">Procesando pago...</div>}>
          <PaymentSuccess />
        </Suspense>
      </div>
    </div>
  )
}
