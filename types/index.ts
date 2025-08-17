// Tipos principales de la aplicación

export interface Book {
  id: string
  slug: string
  title: string
  subtitle?: string
  authors: string[]
  description_md: string
  categories: string[]
  tags: string[]
  coverImage: {
    url: string
    alt: string
    width: number
    height: number
  }
  gallery: Array<{
    url: string
    alt: string
    width: number
    height: number
  }>
  price: number // En centavos
  currency: string // ISO 4217
  formats: {
    ebook?: {
      fileUrl: string
      drm?: boolean
      pages: number
    }
    paperback?: {
      isbn: string
      weight: number // gramos
      dimensions: {
        width: number
        height: number
        depth: number
      }
    }
    hardcover?: {
      isbn: string
      weight: number
      dimensions: {
        width: number
        height: number
        depth: number
      }
    }
  }
  inventory?: number // Para libros físicos
  sku: string
  stripeProductId?: string
  stripePriceId?: string
  releaseDate: string // ISO date
  language: string // ISO 639-1
  samples?: {
    pdfUrl?: string
    epubUrl?: string
  }
  featured: boolean
  rating?: number
  pages?: number
  pageCount?: number
  // SEO
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
}

export interface Collection {
  id: string
  title: string
  slug: string
  description_md: string
  books: string[] // IDs de libros
}

export interface CartItem {
  bookId: string
  format: 'ebook' | 'paperback' | 'hardcover'
  quantity: number
  price: number
}

export interface CheckoutSession {
  items: Array<{
    priceId: string
    quantity: number
  }>
  successUrl: string
  cancelUrl: string
  customerEmail?: string
}

export type ViewMode = '3d' | '2d'
export type PerformanceMode = 'high' | 'medium' | 'low'
export type Language = 'es' | 'en'
