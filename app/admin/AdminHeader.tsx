'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminHeader() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">
            AtomoVisión Admin
          </h1>
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            Panel de Control
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            👤 Administrador
          </span>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Cerrando...' : 'Cerrar Sesión'}
          </button>
        </div>
      </div>
    </header>
  )
}
