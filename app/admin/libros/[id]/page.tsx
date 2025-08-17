'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { AI_TEXT_MODELS, AI_IMAGE_MODELS, LANGUAGES, PUBLICATION_STATUS } from '@/constants/admin'

interface BookForm {
  registroAtomoVision: string
  title: string
  subtitle: string
  genre: string
  authors: Array<{
    name: string
    role: string
    bio: string
    aiModel: string
  }>
  synopsis: string
  fullDescription: string
  excerpt: string
  pageCount: number
  language: string
  pricing: {
    base: number
    currency: string
  }
  status: 'draft' | 'published'
  featured: boolean
  cover: {
    original: string
  }
  formats: {
    epub?: {
      fileUrl: string
      fileSize: number
    }
    pdf?: {
      fileUrl: string
      fileSize: number
    }
  }
  aiGeneration: {
    textModel: string
    textPrompt: string
    coverModel: string
    coverPrompt: string
  }
}

export default function EditBookPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string
  
  const [loading, setLoading] = useState(false)
  const [loadingBook, setLoadingBook] = useState(true)
  const [error, setError] = useState('')
  const [genres, setGenres] = useState<any[]>([])
  
  const [formData, setFormData] = useState<BookForm>({
    registroAtomoVision: '',
    title: '',
    subtitle: '',
    genre: '',
    authors: [{
      name: '',
      role: 'author',
      bio: '',
      aiModel: ''
    }],
    synopsis: '',
    fullDescription: '',
    excerpt: '',
    pageCount: 0,
    language: 'es',
    pricing: {
      base: 999,
      currency: 'EUR'
    },
    status: 'draft',
    featured: false,
    cover: {
      original: ''
    },
    formats: {
      epub: {
        fileUrl: '',
        fileSize: 0
      }
    },
    aiGeneration: {
      textModel: '',
      textPrompt: '',
      coverModel: '',
      coverPrompt: ''
    }
  })
  
  useEffect(() => {
    fetchGenres()
    fetchBook()
  }, [bookId])
  
  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/genres')
      const data = await response.json()
      if (data.success) {
        // Ordenar géneros alfabéticamente por nombre
        const sortedGenres = data.data.sort((a: any, b: any) => 
          a.name.localeCompare(b.name, 'es')
        )
        setGenres(sortedGenres)
      }
    } catch (error) {
      console.error('Error al cargar géneros:', error)
    }
  }
  
  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${bookId}`)
      const data = await response.json()
      
      if (data.success) {
        const book = data.data
        
        // Mapear los datos del libro al formulario
        setFormData({
          registroAtomoVision: book.registroAtomoVision || '',
          title: book.title || '',
          subtitle: book.subtitle || '',
          genre: typeof book.genre === 'object' ? book.genre._id : book.genre,
          authors: book.authors || [{
            name: '',
            role: 'author',
            bio: '',
            aiModel: ''
          }],
          synopsis: book.synopsis || '',
          fullDescription: book.fullDescription || '',
          excerpt: book.excerpt || '',
          pageCount: book.pageCount || 0,
          language: book.language || 'es',
          pricing: {
            base: book.pricing?.base || 999,
            currency: book.pricing?.currency || 'EUR'
          },
          status: book.status || 'draft',
          featured: book.featured || false,
          cover: {
            original: book.cover?.original || ''
          },
          formats: {
            epub: book.formats?.epub ? {
              fileUrl: book.formats.epub.fileUrl || '',
              fileSize: book.formats.epub.fileSize || 0
            } : undefined,
            pdf: book.formats?.pdf ? {
              fileUrl: book.formats.pdf.fileUrl || '',
              fileSize: book.formats.pdf.fileSize || 0
            } : undefined
          },
          aiGeneration: {
            textModel: book.aiGeneration?.textModel || '',
            textPrompt: book.aiGeneration?.textPrompt || '',
            coverModel: book.aiGeneration?.coverModel || '',
            coverPrompt: book.aiGeneration?.coverPrompt || ''
          }
        })
      } else {
        setError('Error al cargar el libro')
      }
    } catch (error) {
      console.error('Error al cargar libro:', error)
      setError('Error al cargar el libro')
    } finally {
      setLoadingBook(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (data.success) {
        router.push('/admin/libros')
      } else {
        setError(data.error || 'Error al actualizar el libro')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof BookForm],
        [field]: value
      }
    }))
  }
  
  const handleAuthorChange = (index: number, field: string, value: string) => {
    const newAuthors = [...formData.authors]
    newAuthors[index] = {
      ...newAuthors[index],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      authors: newAuthors
    }))
  }
  
  if (loadingBook) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Cargando libro...</p>
        </div>
      </div>
    )
  }
  
  if (error && !formData.title) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/admin/libros"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ← Volver al listado
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Libro</h1>
          <p className="text-gray-600">Modifica los datos del libro</p>
        </div>
        <Link
          href="/admin/libros"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          ← Volver al listado
        </Link>
      </div>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Información básica */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registro AtomoVision *
              </label>
              <input
                type="text"
                required
                placeholder="ATV-202501-BP-XXXXXXXX-XXX"
                value={formData.registroAtomoVision}
                onChange={(e) => handleInputChange('registroAtomoVision', e.target.value)}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Debe empezar con ATV-
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género *
              </label>
              <select
                required
                value={formData.genre}
                onChange={(e) => handleInputChange('genre', e.target.value)}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Seleccionar género...</option>
                {genres.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.icon} {genre.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        {/* Autoría */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Autoría</h2>
          
          <div className="space-y-4">
            {formData.authors.map((author, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del autor *
                  </label>
                  <input
                    type="text"
                    required
                    value={author.name}
                    onChange={(e) => handleAuthorChange(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo IA
                  </label>
                  <select
                    value={author.aiModel}
                    onChange={(e) => handleAuthorChange(index, 'aiModel', e.target.value)}
                    className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar modelo...</option>
                    {AI_TEXT_MODELS.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contenido */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contenido</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sinopsis (gancho comercial) *
              </label>
              <textarea
                required
                rows={4}
                maxLength={2000}
                value={formData.synopsis}
                onChange={(e) => handleInputChange('synopsis', e.target.value)}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Una sinopsis atractiva que enganche al lector..."
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.synopsis.length}/2000 caracteres
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de páginas
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.pageCount || ''}
                  onChange={(e) => handleInputChange('pageCount', e.target.value ? parseInt(e.target.value) : 0)}
                  className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Archivos y precio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Archivos y Precio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de portada *
              </label>
              <input
                type="text"
                required
                placeholder="/libros/portadas/mi-libro.jpg"
                value={formData.cover.original}
                onChange={(e) => handleNestedChange('cover', 'original', e.target.value)}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Sube el archivo a /public/libros/portadas/
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL del EPUB
              </label>
              <input
                type="text"
                placeholder="/libros/epubs/mi-libro.epub"
                value={formData.formats.epub?.fileUrl || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  formats: {
                    ...prev.formats,
                    epub: {
                      fileUrl: e.target.value,
                      fileSize: 0
                    }
                  }
                }))}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Sube el archivo a /public/libros/epubs/
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (€) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.pricing.base / 100}
                onChange={(e) => handleNestedChange('pricing', 'base', Math.round((parseFloat(e.target.value) || 0) * 100))}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value={PUBLICATION_STATUS.DRAFT}>Borrador</option>
                <option value={PUBLICATION_STATUS.PUBLISHED}>Publicado</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span>Libro destacado</span>
            </label>
          </div>
        </div>
        
        {/* Metadatos IA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generación IA (Opcional)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo de texto
              </label>
              <select
                value={formData.aiGeneration.textModel}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  aiGeneration: {
                    ...prev.aiGeneration,
                    textModel: e.target.value
                  }
                }))}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Seleccionar modelo...</option>
                {AI_TEXT_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo de portada
              </label>
              <select
                value={formData.aiGeneration.coverModel}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  aiGeneration: {
                    ...prev.aiGeneration,
                    coverModel: e.target.value
                  }
                }))}
                className="w-full px-4 py-2 bg-[#faf9f7] border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Seleccionar modelo...</option>
                {AI_IMAGE_MODELS.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/libros"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Actualizando...' : 'Actualizar Libro'}
          </button>
        </div>
      </form>
    </div>
  )
}
