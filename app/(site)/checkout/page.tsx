import { Metadata } from 'next'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'

export const metadata: Metadata = {
  title: 'Checkout | AtomoVisión',
  description: 'Completa tu pedido de libros digitales',
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 uppercase">Finalizar Pedido</h1>
        <CheckoutForm />
      </div>
    </div>
  )
}
