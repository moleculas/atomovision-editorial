'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Search, Save, BookOpen, CheckCircle, XCircle } from 'lucide-react'
import { Book } from '@/types'

// Componente Toast simple
interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300 max-w-sm ${
      type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    } border rounded-lg shadow-lg p-4 flex items-start gap-3`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className={`text-sm font-medium ${
          type === 'success' ? 'text-green-800' : 'text-red-800'
        }`}>
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className={`text-sm hover:opacity-70 ${
          type === 'success' ? 'text-green-600' : 'text-red-600'
        }`}
      >
        ×
      </button>
    </div>
  )
}

export default function EditHomePage() {
  const [settings, setSettings] = useState({
    featuredBookId: '',
    headerTitle: '',
    headerDescription: '',
    chatQuestions: {
      question1: '',
      question2: '',
      question3: '',
      question4: ''
    }
  })
  
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Cargar configuración actual y libros
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Cargar configuración actual
      const settingsRes = await fetch('/api/admin/home-settings', {
        credentials: 'include'
      })
      
      if (settingsRes.ok) {
        const { settings } = await settingsRes.json()
        
        setSettings({
          featuredBookId: settings.featuredBookId?._id || '',
          headerTitle: settings.headerTitle || '',
          headerDescription: settings.headerDescription || '',
          chatQuestions: settings.chatQuestions || {
            question1: '',
            question2: '',
            question3: '',
            question4: ''
          }
        })
        
        if (settings.featuredBookId) {
          setSelectedBook(settings.featuredBookId)
        }
      }

      // Cargar lista de libros
      const booksRes = await fetch('/api/books?status=published&limit=100', {
        credentials: 'include'
      })
      
      if (booksRes.ok) {
        const data = await booksRes.json()
        // Intentar con ambas estructuras
        const booksArray = data.books || data.data || []
        setBooks(booksArray)
      } else {
        console.error('Error al cargar libros:', booksRes.status)
      }
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book)
    setSettings(prev => ({
      ...prev,
      featuredBookId: (book as any)._id || book.id
    }))
    setSearchQuery('')
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const res = await fetch('/api/admin/home-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        const responseData = await res.json()
        setToast({ message: 'Configuración guardada correctamente', type: 'success' })
      } else {
        const errorData = await res.json()
        setToast({ message: errorData.error || 'Error al guardar la configuración', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error al guardar la configuración', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const filteredBooks = (books || []).filter(book =>
    book?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book?.authors && Array.isArray(book.authors) && book.authors.some(author => {
      if (typeof author === 'string') {
        return author.toLowerCase().includes(searchQuery.toLowerCase())
      } else if (author && typeof author === 'object' && 'name' in author) {
        return (author as any).name?.toLowerCase().includes(searchQuery.toLowerCase())
      }
      return false
    }))
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
        </div>

      <h1 className="text-3xl font-bold mb-6">Editar Página de Inicio</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Libro Destacado</h2>
        
        {/* Libro seleccionado */}
        {selectedBook && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-start gap-4">
            {selectedBook.coverImage?.url && (
              <Image 
                src={selectedBook.coverImage.url} 
                alt={selectedBook.title}
                width={80}
                height={120}
                className="w-20 h-30 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{selectedBook.title}</h3>
              <p className="text-sm text-gray-600">{selectedBook.authors?.map(a => typeof a === 'string' ? a : (a as any).name).join(', ') || 'Sin autor'}</p>
              <p className="text-sm text-gray-500 mt-1">{(selectedBook as any).genre?.name || 'Sin género'}</p>
            </div>
            <button
              onClick={() => {
                setSelectedBook(null)
                setSettings(prev => ({ ...prev, featuredBookId: '' }))
              }}
              className="text-red-600 hover:text-red-800"
            >
              Quitar
            </button>
          </div>
        )}

        {/* Buscador de libros */}
        {!selectedBook && (
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar libro por título o autor..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {(!books || books.length === 0) && (
                <p className="text-gray-500 text-center py-4">
                  No hay libros publicados disponibles.
                </p>
              )}
              {books && books.length > 0 && filteredBooks.length === 0 && searchQuery && (
                <p className="text-gray-500 text-center py-4">
                  No se encontraron libros que coincidan con &quot;{searchQuery}&quot;
                </p>
              )}
              {filteredBooks.map((book) => (
                <button
                  key={(book as any)._id || book.id}
                  onClick={() => handleSelectBook(book)}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-start gap-3 text-left transition-colors"
                >
                  {book.coverImage?.url ? (
                    <Image 
                      src={book.coverImage.url} 
                      alt={book.title}
                      width={48}
                      height={72}
                      className="w-12 h-18 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-18 bg-gray-200 rounded flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.authors?.map(a => typeof a === 'string' ? a : (a as any).name).join(', ') || 'Sin autor'}</p>
                    <p className="text-xs text-gray-500">{(book as any).genre?.name || 'Sin género'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Textos del Header</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título Principal
          </label>
          <input
            type="text"
            value={settings.headerTitle}
            onChange={(e) => setSettings(prev => ({ ...prev, headerTitle: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={settings.headerDescription}
            onChange={(e) => setSettings(prev => ({ ...prev, headerDescription: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Preguntas del Chat</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pregunta 1
            </label>
            <input
              type="text"
              value={settings.chatQuestions.question1}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                chatQuestions: { ...prev.chatQuestions, question1: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
              placeholder="¿Cómo es el mundo donde vives?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pregunta 2
            </label>
            <input
              type="text"
              value={settings.chatQuestions.question2}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                chatQuestions: { ...prev.chatQuestions, question2: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
              placeholder="¿Cuál es tu mayor miedo?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pregunta 3
            </label>
            <input
              type="text"
              value={settings.chatQuestions.question3}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                chatQuestions: { ...prev.chatQuestions, question3: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
              placeholder="Cuéntame sobre los otros personajes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pregunta 4
            </label>
            <input
              type="text"
              value={settings.chatQuestions.question4}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                chatQuestions: { ...prev.chatQuestions, question4: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary"
              placeholder="¿Qué secretos guardas?"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        </div>
      </div>
    </>
  )
}
