'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totalBooks: number
  publishedBooks: number
  draftBooks: number
  totalGenres: number
  featuredBooks: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    publishedBooks: 0,
    draftBooks: 0,
    totalGenres: 0,
    featuredBooks: 0,
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchStats()
  }, [])
  
  const fetchStats = async () => {
    try {
      // Obtener estadísticas de libros
      const booksResponse = await fetch('/api/books?status=all&limit=1')
      const booksData = await booksResponse.json()
      
      // Obtener géneros
      const genresResponse = await fetch('/api/genres')
      const genresData = await genresResponse.json()
      
      // Obtener libros publicados
      const publishedResponse = await fetch('/api/books?status=published&limit=1')
      const publishedData = await publishedResponse.json()
      
      // Obtener borradores
      const draftResponse = await fetch('/api/books?status=draft&limit=1')
      const draftData = await draftResponse.json()
      
      // Obtener destacados
      const featuredResponse = await fetch('/api/books?featured=true&limit=1')
      const featuredData = await featuredResponse.json()
      
      setStats({
        totalBooks: booksData.pagination?.total || 0,
        publishedBooks: publishedData.pagination?.total || 0,
        draftBooks: draftData.pagination?.total || 0,
        totalGenres: genresData.count || 0,
        featuredBooks: featuredData.pagination?.total || 0,
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const statCards = [
    {
      title: 'Total Libros',
      value: stats.totalBooks,
      icon: '📚',
      color: 'from-blue-600 to-blue-700',
      link: '/admin/libros'
    },
    {
      title: 'Publicados',
      value: stats.publishedBooks,
      icon: '✅',
      color: 'from-green-600 to-green-700',
      link: '/admin/libros?status=published'
    },
    {
      title: 'Borradores',
      value: stats.draftBooks,
      icon: '📝',
      color: 'from-yellow-600 to-yellow-700',
      link: '/admin/libros?status=draft'
    },
    {
      title: 'Géneros',
      value: stats.totalGenres,
      icon: '🏷️',
      color: 'from-purple-600 to-purple-700',
      link: '/admin/generos'
    },
    {
      title: 'Destacados',
      value: stats.featuredBooks,
      icon: '⭐',
      color: 'from-pink-600 to-pink-700',
      link: '/admin/libros?featured=true'
    },
  ]
  
  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Vista general del catálogo AtomoVisión</p>
      </div>
      
      {/* Grid de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Ver →
              </span>
            </div>
            
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <span className="inline-block w-12 h-8 bg-gray-200 animate-pulse rounded" />
                ) : (
                  stat.value
                )}
              </p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Acciones rápidas */}
      <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/libros/nuevo"
            className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition duration-200 border border-red-200"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-medium text-gray-900">Añadir Libro</p>
              <p className="text-sm text-gray-600">Crear nuevo libro en el catálogo</p>
            </div>
          </Link>
          
          <Link
            href="/admin/libros"
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200 border border-gray-200"
          >
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-medium text-gray-900">Gestionar Catálogo</p>
              <p className="text-sm text-gray-600">Ver y editar todos los libros</p>
            </div>
          </Link>
          
          <Link
            href="/admin/ventas"
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition duration-200 border border-green-200"
          >
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-medium text-gray-900">Ver Ventas</p>
              <p className="text-sm text-gray-600">Estadísticas y reportes</p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Info del sistema */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>AtomoVisión Admin v1.0 | Editorial de libros generados por IA</p>
      </div>
    </div>
  )
}
