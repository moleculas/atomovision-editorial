import Link from 'next/link'
import { XCircle, ShoppingCart, HelpCircle } from 'lucide-react'

export default function CancelPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-playfair mb-4">Pago cancelado</h1>
          <p className="text-lg text-muted-foreground">
            Has cancelado el proceso de pago. Tu carrito sigue intacto.
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            ¿Tuviste algún problema?
          </h2>
          <p className="text-muted-foreground mb-4">
            Si encontraste algún problema durante el proceso de pago, estamos aquí para ayudarte.
            Algunas razones comunes por las que los clientes cancelan:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Información de pago incorrecta</li>
            <li>Dudas sobre el proceso de compra</li>
            <li>Costos de envío inesperados</li>
            <li>Preferencia por otro método de pago</li>
          </ul>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cart"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Volver al carrito
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors text-center"
          >
            Contactar soporte
          </Link>
        </div>

        {/* Información adicional */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6">
          <h3 className="font-semibold mb-2">💡 Consejo</h3>
          <p className="text-sm">
            Tu carrito se ha guardado y puedes completar tu compra en cualquier momento.
            Los artículos permanecerán en tu carrito durante los próximos 7 días.
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            ¿Prefieres explorar más opciones? Visita nuestro{' '}
            <Link href="/catalog" className="text-primary hover:underline">
              catálogo completo
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
