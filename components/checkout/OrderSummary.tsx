'use client'

import { useCartStore } from '@/lib/store'
import { Trash2 } from 'lucide-react'

export function OrderSummary() {
  const { items, getTotalPrice, removeItem } = useCartStore()

  const subtotal = getTotalPrice()
  const tax = 0 // No aplicamos impuestos a libros digitales
  const total = subtotal + tax

  const handleRemoveItem = (bookId: string, format: string) => {
    removeItem(bookId, format)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div key={item.bookId || `item-${index}`} className="flex gap-4">
                {/* Imagen */}
                <div className="w-16 h-24 flex-shrink-0">
                  {item.coverImage?.url ? (
                    <img
                      src={item.coverImage.url}
                      alt={item.title || 'Libro'}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500 text-center px-1">
                        Sin imagen
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Detalles */}
                <div className="flex-1">
                  <h3 className="font-medium text-sm line-clamp-2">{item.title || 'Sin título'}</h3>
                  <p className="text-sm text-gray-600">
                    {item.selectedFormat === 'ebook' ? 'eBook' : 
                     item.selectedFormat === 'paperback' ? 'Tapa blanda' : 'Tapa dura'}
                  </p>
                  <p className="text-sm">
                    {item.quantity} × {(item.price / 100).toFixed(2)} €
                  </p>
                </div>
                
                {/* Precio y eliminar */}
                <div className="flex flex-col items-end gap-2">
                  <p className="font-medium">
                    {((item.price * item.quantity) / 100).toFixed(2)} €
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.bookId, item.format)}
                    className="relative group p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {/* Tooltip personalizado */}
                    <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      Eliminar del carrito
                      {/* Flecha del tooltip */}
                      <span className="absolute top-full right-2 w-0 h-0 border-4 border-transparent border-t-gray-800"></span>
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Totales */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{(subtotal / 100).toFixed(2)} €</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-sm">
                <span>Impuestos</span>
                <span>{(tax / 100).toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <div className="text-right">
                <span>{(total / 100).toFixed(2)} €</span>
                <p className="text-xs text-muted-foreground font-normal">(Impuestos incl.)</p>
              </div>
            </div>
          </div>
          
          {/* Métodos de pago */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3">Métodos de pago aceptados:</p>
            <div className="flex gap-2">
              <div className="text-xs text-gray-500">
                • Tarjeta de crédito/débito
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
