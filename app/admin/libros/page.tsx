'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Book } from '@/lib/services/book.service'

export default function AdminBooksPage() {
  const searchParams = useSearchParams()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all')
  const [genres, setGenres] = useState<any[]>([])
  
  useEffect(() => {
    fetchGenres()
  }, [])
  
  useEffect(() => {
    fetchBooks()
  }, [page, selectedGenre, selectedStatus])
  
  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/genres')
      const data = await response.json()
      if (data.success) {
        setGenres(data.data)
      }
    } catch (error) {
      console.error('Error al cargar géneros:', error)
    }
  }
  
  const fetchBooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        status: selectedStatus,
      })
      
      if (selectedGenre) params.append('genre', selectedGenre)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/books?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setBooks(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error al cargar libros:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchBooks()
  }
  
  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    
    const labels = {
      published: 'Publicado',
      draft: 'Borrador',
      archived: 'Archivado',
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price / 100)
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Libros</h1>
          <p className="text-gray-600">Gestiona todos los libros de AtomoVisión</p>
        </div>
        <Link
          href="/admin/libros/nuevo"
          className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-200"
        >
          ➕ Nuevo Libro
        </Link>
      </div>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar por título, autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          
          <select
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todos los géneros</option>
            {genres.map((genre) => (
              <option key={genre._id} value={genre.code}>
                {genre.icon} {genre.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
            <option value="archived">Archivados</option>
          </select>
          
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            🔍 Buscar
          </button>
        </form>
      </div>
      
      {/* Tabla de libros */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Cargando libros...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No se encontraron libros</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Libro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro ATV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Género
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {book.cover?.thumbnail && (
                          <img
                            src={book.cover.thumbnail}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="text-gray-900 font-medium">{book.title}</p>
                          <p className="text-sm text-gray-600">
                            {book.authors.map(a => a.name).join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-600">
                        {book.registroAtomoVision}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {typeof book.genre === 'object' && book.genre ? 
                          `${book.genre.icon || ''} ${book.genre.name || 'Sin nombre'}`.trim() : 
                          'Sin género'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {formatPrice(book.pricing.base)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(book.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/libros/${book._id}`}
                          className="text-red-600 hover:text-red-700 transition"
                        >
                          ✏️ Editar
                        </Link>
                        <a
                          href={`/libro/${book.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-700 transition"
                        >
                          👁️ Ver
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
          >
            ← Anterior
          </button>
          <span className="px-4 py-2 text-gray-400">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
