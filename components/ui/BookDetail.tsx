'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Book } from '@/types'
import { useCartStore } from '@/lib/store'
import { Star, ShoppingCart, Download, BookOpen, ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface BookDetailProps {
  book: Book
}

export function BookDetail({ book }: BookDetailProps) {
  const [selectedFormat, setSelectedFormat] = useState<'ebook' | 'paperback'>('ebook')
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hasRated, setHasRated] = useState(false)
  const [currentRating, setCurrentRating] = useState(book.rating || 0)
  const addItem = useCartStore((state) => state.addItem)

  // Verificar si el usuario ya ha votado
  useEffect(() => {
    const ratedBooks = JSON.parse(localStorage.getItem('ratedBooks') || '{}')
    if (ratedBooks[book.id]) {
      setHasRated(true)
      setUserRating(ratedBooks[book.id])
    }
  }, [book.id])

  const handleRating = (rating: number) => {
    if (hasRated) return
    
    setUserRating(rating)
    setHasRated(true)
    
    // Guardar en localStorage
    const ratedBooks = JSON.parse(localStorage.getItem('ratedBooks') || '{}')
    ratedBooks[book.id] = rating
    localStorage.setItem('ratedBooks', JSON.stringify(ratedBooks))
    
    // Aquí podrías hacer una llamada a la API para actualizar el rating
    // Por ahora solo actualizamos visualmente
    setCurrentRating((currentRating * 10 + rating) / 11) // Simulación simple
  }

  const handleAddToCart = () => {
    addItem(book, selectedFormat, 1)
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="hover:text-primary">Inicio</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/catalog" className="hover:text-primary">Catálogo</Link>
            </li>
            <li>/</li>
            <li className="text-muted-foreground">{book.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-full max-w-xl shadow-2xl">
              {book.coverImage.url ? (
                <img 
                  src={book.coverImage.url} 
                  alt={book.coverImage.alt}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[2/3] bg-accent rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <h2 className="font-playfair text-3xl mb-4">{book.title}</h2>
                    <p className="text-lg text-muted-foreground">{book.authors.join(', ')}</p>
                  </div>
                </div>
              )}
              {book.featured && (
                <span className="absolute top-4 right-4 bg-primary text-white text-sm px-3 py-1 rounded-full">
                  Destacado
                </span>
              )}
            </div>
          </motion.div>

          {/* Información del libro */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-2 uppercase">{book.title}</h1>
            {book.subtitle && (
              <p className="text-xl text-muted-foreground mb-4">{book.subtitle}</p>
            )}

            <p className="text-lg mb-4">Por {book.authors.join(', ')}</p>

            {/* Rating interactivo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleRating(i + 1)}
                    disabled={hasRated}
                    className={`${hasRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        i < Math.floor(currentRating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {currentRating.toFixed(1)} de 5 estrellas
              </span>
              {hasRated && (
                <span className="text-xs text-muted-foreground">(Ya has votado)</span>
              )}
            </div>

            {/* Precio */}
            <div className="text-3xl font-bold mb-6">
              {(book.price / 100).toFixed(2)} {book.currency}
            </div>

            {/* Selección de formato */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Formato</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedFormat('ebook')}
                  className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                    selectedFormat === 'ebook'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium">eBook</p>
                    {book.formats.ebook && (
                      <p className="text-sm text-muted-foreground">{book.pageCount || 0} páginas</p>
                    )}
                  </div>
                </button>
                
                <button
                  disabled
                  className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                >
                  <div className="text-left">
                    <p className="font-medium text-gray-400">Tapa blanda</p>
                    <p className="text-sm text-gray-400">Registro: {book.sku}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Botón añadir al carrito */}
            <div className="mb-8">
              <button
                onClick={handleAddToCart}
                className="w-full md:w-1/2 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir al carrito
              </button>
            </div>

            {/* Descripción */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Descripción</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {book.description_md}
              </p>
            </div>

            {/* Detalles del producto */}
            <div className="mb-8 pt-8 border-t">
              <h3 className="text-xl font-semibold mb-4">Detalles del producto</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Fecha de publicación</dt>
                  <dd className="font-medium">{new Date(book.releaseDate).toLocaleDateString('es-ES')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Idioma</dt>
                  <dd className="font-medium">{book.language === 'es' ? 'Español' : book.language.toUpperCase()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Registro ATV</dt>
                  <dd className="font-medium">{book.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Disponibilidad</dt>
                  <dd className={`font-medium ${book.inventory && book.inventory > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.inventory && book.inventory > 0 ? `${book.inventory} en stock` : 'Agotado'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Etiquetas */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Etiquetas</h3>
              <div className="flex flex-wrap gap-2">
                {/* Etiquetas mock temporales */}
                {['espacio', 'cuántica', 'aventura', 'IA', 'futuro', 'misterio'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sección de libros relacionados */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8">Libros relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* TODO: Cargar libros relacionados */}
            <p className="col-span-full text-center text-muted-foreground py-8">
              Próximamente más libros de {book.categories[0] || 'esta categoría'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
