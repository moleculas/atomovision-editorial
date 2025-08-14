'use client'

import Link from 'next/link'
import { useCartStore, useUIStore } from '@/lib/store'
import { ShoppingCart, Search, Menu, X, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { toggleCart, toggleSearch, viewMode, setViewMode, performanceMode, setPerformanceMode } = useUIStore()
  const totalItems = useCartStore((state) => state.getTotalItems())

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
            <Link href="/about" className="hover:text-primary transition-colors">
              Nosotros
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-2 py-1 rounded ${viewMode === '3d' ? 'bg-primary text-white' : 'text-foreground'}`}
              >
                3D
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`px-2 py-1 rounded ${viewMode === '2d' ? 'bg-primary text-white' : 'text-foreground'}`}
              >
                2D
              </button>
            </div>

            {/* Performance Mode */}
            {viewMode === '3d' && (
              <select
                value={performanceMode}
                onChange={(e) => setPerformanceMode(e.target.value as any)}
                className="hidden md:block text-sm bg-transparent border rounded px-2 py-1"
              >
                <option value="high">Alto</option>
                <option value="medium">Medio</option>
                <option value="low">Bajo</option>
              </select>
            )}

            {/* Search */}
            <button
              onClick={toggleSearch}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-accent rounded-lg transition-colors relative"
              aria-label="Carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

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
                href="/about"
                className="block hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nosotros
              </Link>
              
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modo de vista</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('3d')}
                      className={`px-3 py-1 rounded text-sm ${viewMode === '3d' ? 'bg-primary text-white' : 'bg-accent'}`}
                    >
                      3D
                    </button>
                    <button
                      onClick={() => setViewMode('2d')}
                      className={`px-3 py-1 rounded text-sm ${viewMode === '2d' ? 'bg-primary text-white' : 'bg-accent'}`}
                    >
                      2D
                    </button>
                  </div>
                </div>
                
                {viewMode === '3d' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rendimiento</span>
                    <select
                      value={performanceMode}
                      onChange={(e) => setPerformanceMode(e.target.value as any)}
                      className="text-sm bg-accent border rounded px-3 py-1"
                    >
                      <option value="high">Alto</option>
                      <option value="medium">Medio</option>
                      <option value="low">Bajo</option>
                    </select>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
