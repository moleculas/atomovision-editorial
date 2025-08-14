'use client'

import { useState } from 'react'
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
  const [selectedFormat, setSelectedFormat] = useState<keyof typeof book.formats>(
    book.formats.ebook ? 'ebook' : book.formats.paperback ? 'paperback' : 'hardcover'
  )
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(book, selectedFormat, quantity)
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
          {/* Imagen y galería */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[2/3] bg-accent rounded-lg flex items-center justify-center mb-4">
              <div className="text-center p-8">
                <h2 className="font-playfair text-3xl mb-4">{book.title}</h2>
                <p className="text-lg text-muted-foreground">{book.authors.join(', ')}</p>
              </div>
            </div>

            {/* Galería de imágenes (si hay) */}
            {book.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {book.gallery.map((image, index) => (
                  <div key={index} className="aspect-square bg-accent rounded"></div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Información del libro */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-playfair mb-2">{book.title}</h1>
            {book.subtitle && (
              <p className="text-xl text-muted-foreground mb-4">{book.subtitle}</p>
            )}

            <p className="text-lg mb-4">Por {book.authors.join(', ')}</p>

            {/* Rating */}
            {book.rating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(book.rating!) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {book.rating} de 5 estrellas
                </span>
              </div>
            )}

            {/* Precio */}
            <div className="text-3xl font-bold mb-6">
              {(book.price / 100).toFixed(2)} {book.currency}
            </div>

            {/* Selección de formato */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Formato</h3>
              <div className="flex gap-3">
                {Object.entries(book.formats).map(([format, data]) => {
                  if (!data) return null
                  return (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format as keyof typeof book.formats)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        selectedFormat === format
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium">
                          {format === 'ebook' ? 'eBook' : 
                           format === 'paperback' ? 'Tapa blanda' : 'Tapa dura'}
                        </p>
                        {format === 'ebook' && data.pages && (
                          <p className="text-sm text-muted-foreground">{data.pages} páginas</p>
                        )}
                        {(format === 'paperback' || format === 'hardcover') && 'isbn' in data && (
                          <p className="text-sm text-muted-foreground">ISBN: {data.isbn}</p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Cantidad y añadir al carrito */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border hover:bg-accent transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border hover:bg-accent transition-colors"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir al carrito
              </button>
            </div>

            {/* Muestras */}
            {book.samples && (
              <div className="flex gap-3 mb-8">
                {book.samples.pdfUrl && (
                  <a
                    href={book.samples.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Muestra PDF
                  </a>
                )}
                {book.samples.epubUrl && (
                  <a
                    href={book.samples.epubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Muestra ePub
                  </a>
                )}
              </div>
            )}

            {/* Descripción */}
            <div className="prose prose-lg max-w-none">
              <h3 className="font-semibold mb-3">Descripción</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {book.description_md}
              </p>
            </div>

            {/* Detalles adicionales */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold mb-4">Detalles del producto</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Fecha de publicación</dt>
                  <dd>{new Date(book.releaseDate).toLocaleDateString('es-ES')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Idioma</dt>
                  <dd>{book.language === 'es' ? 'Español' : book.language.toUpperCase()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">SKU</dt>
                  <dd>{book.sku}</dd>
                </div>
                {book.inventory && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Disponibilidad</dt>
                    <dd className={book.inventory > 0 ? 'text-green-600' : 'text-red-600'}>
                      {book.inventory > 0 ? `${book.inventory} en stock` : 'Agotado'}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Tags */}
            {book.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-accent rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
