'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Genre {
  _id: string
  code: string
  name: string
  icon: string
  color: string
  bookCount: number
  order: number
  featured: boolean
}

export default function AdminGenresPage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    fetchGenres()
  }, [])
  
  const fetchGenres = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/genres')
      const data = await response.json()
      
      if (data.success) {
        // Ordenar por orden y luego por nombre
        const sortedGenres = data.data.sort((a: Genre, b: Genre) => {
          if (a.order !== b.order) return a.order - b.order
          return a.name.localeCompare(b.name, 'es')
        })
        setGenres(sortedGenres)
      }
    } catch (error) {
      console.error('Error al cargar géneros:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Filtrar géneros según búsqueda
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    genre.code.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Calcular totales
  const totalGenres = filteredGenres.length
  const totalBooks = filteredGenres.reduce((sum, genre) => sum + genre.bookCount, 0)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Géneros Literarios</h1>
        <p className="text-gray-600">Listado de géneros y cantidad de libros por género</p>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total de géneros</p>
          <p className="text-2xl font-bold text-gray-900">{totalGenres}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total de libros</p>
          <p className="text-2xl font-bold text-gray-900">{totalBooks}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Promedio por género</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalGenres > 0 ? (totalBooks / totalGenres).toFixed(1) : 0}
          </p>
        </div>
      </div>
      
      {/* Búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <input
          type="text"
          placeholder="Buscar género..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      {/* Tabla de géneros */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Cargando géneros...</p>
          </div>
        ) : filteredGenres.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No se encontraron géneros' : 'No hay géneros disponibles'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Género
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nº de Libros
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destacado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredGenres.map((genre) => (
                  <tr key={genre._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{genre.icon}</span>
                        <span className="text-gray-900 font-medium">{genre.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-600">{genre.code}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div 
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: genre.color }}
                          title={genre.color}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-lg font-semibold ${
                        genre.bookCount > 0 ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {genre.bookCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {genre.featured ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
