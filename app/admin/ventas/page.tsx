'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  ShoppingBag, 
  Calendar, 
  Search, 
  Download, 
  Eye,
  TrendingUp,
  Euro,
  Package,
  Users
} from 'lucide-react'

interface Purchase {
  _id: string
  email: string
  customerName?: string
  items: Array<{
    book: {
      _id: string
      title: string
      genre?: {
        name: string
        icon?: string
      }
    }
    format: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  downloadCount: number
  createdAt: string
  stripeSessionId?: string
}

interface Stats {
  totalSales: number
  totalRevenue: number
  totalBooks: number
  totalCustomers: number
  bestSeller?: {
    title: string
    sales: number
  }
  recentSales: number
}

export default function VentasPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    fetchPurchases()
    fetchStats()
  }, [])

  useEffect(() => {
    filterPurchases()
  }, [purchases, searchTerm, statusFilter, dateFilter])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/admin/purchases')
      const data = await response.json()
      
      if (data.success) {
        setPurchases(data.data)
      }
    } catch (error) {
      console.error('Error cargando ventas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    }
  }

  const filterPurchases = () => {
    let filtered = [...purchases]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.items.some(item => item.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    // Filtro por fecha
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
      }
      
      filtered = filtered.filter(p => new Date(p.createdAt) >= filterDate)
    }

    setFilteredPurchases(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Cargando ventas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Ventas</h1>
        <p className="text-gray-600">Administra y revisa todas las ventas de la editorial</p>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalSales}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.recentSales} en los últimos 30 días
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(stats.totalRevenue / 100).toFixed(2)} €
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Antes de impuestos
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Libros Vendidos</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalBooks}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Unidades totales
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalCustomers}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Compradores diferentes
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bestseller */}
      {stats?.bestSeller && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Libro más vendido</h3>
          </div>
          <p className="text-lg font-medium text-gray-800">{stats.bestSeller.title}</p>
          <p className="text-sm text-gray-600">{stats.bestSeller.sales} ventas</p>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por email, cliente o libro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completadas</option>
              <option value="pending">Pendientes</option>
              <option value="failed">Fallidas</option>
              <option value="refunded">Reembolsadas</option>
            </select>
          </div>
          
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Libros
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descargas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {purchase.customerName || 'Sin nombre'}
                      </div>
                      <div className="text-sm text-gray-500">{purchase.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {purchase.items.map((item, index) => (
                        <div key={index} className="mb-1">
                          {item.book?.genre?.icon} {item.book?.title || 'Libro eliminado'} ({item.quantity})
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(purchase.totalAmount / 100).toFixed(2)} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                      {getStatusText(purchase.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Download className="w-4 h-4 mr-1" />
                      {purchase.downloadCount} / 3
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(purchase.createdAt), { 
                        addSuffix: true,
                        locale: es 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/ventas/${purchase._id}`}
                      className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPurchases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron ventas con los filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
