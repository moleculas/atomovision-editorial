'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  ArrowLeft,
  Package,
  Mail,
  CreditCard,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Clock
} from 'lucide-react'

interface PurchaseDetail {
  _id: string
  email: string
  customerName?: string
  items: Array<{
    book: {
      _id: string
      title: string
      subtitle?: string
      slug: string
      authors: Array<{ name: string }>
      genre?: {
        name: string
        icon?: string
        color?: string
      }
      coverImage?: {
        url: string
      }
    }
    format: string
    quantity: number
    price: number
  }>
  totalAmount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  stripeSessionId?: string
  stripePaymentIntentId?: string
  stripeReceiptUrl?: string
  downloadToken: string
  downloadExpiry: string
  downloadCount: number
  downloadHistory: Array<{
    downloadedAt: string
    ipAddress: string
    userAgent?: string
    bookId: string
  }>
  createdAt: string
  updatedAt: string
}

export default function VentaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const purchaseId = params.id as string
  
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    fetchPurchase()
  }, [purchaseId])

  const fetchPurchase = async () => {
    try {
      const response = await fetch(`/api/admin/purchases/${purchaseId}`)
      const data = await response.json()
      
      if (data.success) {
        setPurchase(data.data)
      } else {
        console.error('Error:', data.error)
      }
    } catch (error) {
      console.error('Error cargando venta:', error)
    } finally {
      setLoading(false)
    }
  }

  const resendEmail = async () => {
    if (!purchase || sendingEmail) return
    
    setSendingEmail(true)
    try {
      const response = await fetch(`/api/admin/purchases/${purchaseId}/resend-email`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert('Email reenviado exitosamente')
      } else {
        alert('Error al reenviar email: ' + data.error)
      }
    } catch (error) {
      console.error('Error reenviando email:', error)
      alert('Error al reenviar email')
    } finally {
      setSendingEmail(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'refunded':
        return <RefreshCw className="w-5 h-5 text-gray-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'pending':
        return 'Pendiente'
      case 'failed':
        return 'Fallida'
      case 'refunded':
        return 'Reembolsada'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Cargando detalles de la venta...</p>
        </div>
      </div>
    )
  }

  if (!purchase) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No se encontró la venta</p>
        <Link
          href="/admin/ventas"
          className="text-red-600 hover:text-red-700"
        >
          ← Volver a ventas
        </Link>
      </div>
    )
  }

  const isDownloadActive = new Date(purchase.downloadExpiry) > new Date() && 
                          purchase.downloadCount < 3 &&
                          purchase.status === 'completed'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/ventas"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalle de Venta #{purchase._id.slice(-8)}
            </h1>
            <p className="text-gray-600">
              {format(new Date(purchase.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
            </p>
          </div>
        </div>
        
        {purchase.status === 'completed' && (
          <button
            onClick={resendEmail}
            disabled={sendingEmail}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            {sendingEmail ? 'Enviando...' : 'Reenviar Email'}
          </button>
        )}
      </div>

      {/* Estado y resumen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Información del cliente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{purchase.email}</p>
                </div>
              </div>
              {purchase.customerName && (
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium">{purchase.customerName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Libros comprados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Libros Comprados</h2>
            <div className="space-y-4">
              {purchase.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  {item.book.coverImage?.url && (
                    <img
                      src={item.book.coverImage.url}
                      alt={item.book.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.book.title}
                    </h3>
                    {item.book.subtitle && (
                      <p className="text-sm text-gray-600">{item.book.subtitle}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {item.book.authors.map(a => a.name).join(', ')}
                    </p>
                    {item.book.genre && (
                      <span 
                        className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: item.book.genre.color + '20', color: item.book.genre.color }}
                      >
                        {item.book.genre.icon} {item.book.genre.name}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(item.price / 100).toFixed(2)} €</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                    <p className="text-sm text-gray-500 capitalize">{item.format}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {(purchase.totalAmount / 100).toFixed(2)} {purchase.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Historial de descargas */}
          {purchase.downloadHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Descargas</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispositivo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchase.downloadHistory.map((download, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {format(new Date(download.downloadedAt), "d/MM/yyyy HH:mm")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">
                          {download.ipAddress}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          <span className="truncate max-w-xs block" title={download.userAgent}>
                            {download.userAgent || 'Desconocido'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar con información adicional */}
        <div className="space-y-6">
          {/* Estado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Pedido</h3>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(purchase.status)}`}>
              {getStatusIcon(purchase.status)}
              <span className="font-medium">{getStatusText(purchase.status)}</span>
            </div>
          </div>

          {/* Información de pago */}
          {(purchase.stripeSessionId || purchase.stripePaymentIntentId) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Pago</h3>
              <div className="space-y-3 text-sm">
                {purchase.stripeSessionId && (
                  <div>
                    <p className="text-gray-600">Sesión Stripe</p>
                    <p className="font-mono text-xs break-all">{purchase.stripeSessionId}</p>
                  </div>
                )}
                {purchase.stripeReceiptUrl && (
                  <a
                    href={purchase.stripeReceiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <CreditCard className="w-4 h-4" />
                    Ver recibo
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Información de descarga */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Descarga</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Descargas realizadas</span>
                <span className="font-medium">{purchase.downloadCount} / 3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expira</span>
                <span className="font-medium">
                  {format(new Date(purchase.downloadExpiry), "d/MM/yyyy")}
                </span>
              </div>
              <div className="pt-3 border-t">
                <div className={`text-sm font-medium ${isDownloadActive ? 'text-green-600' : 'text-red-600'}`}>
                  {isDownloadActive ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Enlaces activos
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Enlaces expirados o agotados
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fechas</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Creado</p>
                <p className="font-medium">
                  {format(new Date(purchase.createdAt), "d/MM/yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Actualizado</p>
                <p className="font-medium">
                  {format(new Date(purchase.updatedAt), "d/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
