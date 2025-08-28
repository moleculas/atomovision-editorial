'use client'

import Link from 'next/link'
import { useCartStore, useUIStore } from '@/lib/store'
import { ShoppingCart, Search, Menu, X, BookOpen, Loader2 } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { searchBooks } from '@/lib/cms'
import { Book } from '@/types'

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Book[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { viewMode, setViewMode, performanceMode, setPerformanceMode } = useUIStore()
  const totalItems = useCartStore((state) => state.getTotalItems())

  // Búsqueda en tiempo real con debounce
  const performSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setSearchResults([])
        setShowResults(false)
        return
      }

      setIsSearching(true)
      try {
        const results = await searchBooks(query)
        setSearchResults(results.slice(0, 5)) // Mostrar solo 5 resultados
        setShowResults(true)
      } catch (error) {
        console.error('Error en búsqueda:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
    []
  )

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    performSearch(value)
  }

  // Manejar búsqueda con Enter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/busqueda?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setShowResults(false)
      setSearchQuery('')
    }
  }

  // Manejar click en resultado
  const handleResultClick = (slug: string) => {
    router.push(`/libro/${slug}`)
    setIsSearchOpen(false)
    setShowResults(false)
    setSearchQuery('')
  }

  // Cerrar resultados al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cerrar búsqueda con Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setShowResults(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Enfocar input cuando se abre
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <span className="text-xl font-playfair font-bold">AtomoVisión</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/catalog" className="hover:text-primary transition-colors">
              Catálogo
            </Link>
            <Link href="/collections" className="hover:text-primary transition-colors">
              Colecciones
            </Link>
            <Link href="/editorial" className="hover:text-primary transition-colors">
              Editorial
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">

            {/* Search Input */}
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  ref={searchContainerRef}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <form onSubmit={handleSearch}>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleInputChange}
                      placeholder="Buscar libros..."
                      className="w-full px-3 py-1.5 bg-accent rounded-lg text-sm outline-none border-0 focus:outline-none focus:ring-0 focus:border-0"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-500" />
                    )}
                  </form>
                  
                  {/* Dropdown de resultados */}
                  <AnimatePresence>
                    {showResults && (searchResults.length > 0 || searchQuery.length >= 3) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 w-full bg-card rounded-lg shadow-lg border overflow-hidden z-50"
                      >
                        {searchResults.length > 0 ? (
                          <>
                            {searchResults.map((book) => (
                              <button
                                key={book.id}
                                onClick={() => handleResultClick(book.slug)}
                                className="w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-center gap-3"
                              >
                                {book.coverImage?.url && (
                                  <img
                                    src={book.coverImage.url}
                                    alt={book.title}
                                    className="w-10 h-14 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{book.title}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {book.authors.join(', ')}
                                  </p>
                                </div>
                              </button>
                            ))}
                            <Link
                              href={`/busqueda?q=${encodeURIComponent(searchQuery)}`}
                              onClick={() => {
                                setIsSearchOpen(false)
                                setShowResults(false)
                              }}
                              className="block w-full text-center px-4 py-3 bg-accent hover:bg-accent/80 text-sm font-medium transition-colors"
                            >
                              Ver todos los resultados
                            </Link>
                          </>
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No se encontraron resultados
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/checkout"
              className="p-2 hover:bg-accent rounded-lg transition-colors relative inline-block"
              aria-label="Carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <nav className="container mx-auto px-4 py-4 space-y-4">
              {/* Búsqueda móvil */}
              <form onSubmit={handleSearch} className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Buscar libros..."
                  className="w-full px-4 py-2 bg-accent rounded-lg text-sm outline-none border-0 focus:outline-none focus:ring-0 focus:border-0"
                />
              </form>
              
              <Link
                href="/catalog"
                className="block hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link
                href="/collections"
                className="block hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Colecciones
              </Link>
              <Link
                href="/editorial"
                className="block hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Editorial
              </Link>

            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
