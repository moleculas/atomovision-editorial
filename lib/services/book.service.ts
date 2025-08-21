// Servicio para interactuar con la API de libros

export interface Book {
  _id: string
  registroAtomoVision: string
  isbn?: string
  title: string
  subtitle?: string
  slug: string
  genre: string | {
    _id: string
    name: string
    code: string
    color?: string
    icon?: string
  }
  authors: Array<{
    name: string
    role: string
    bio?: string
    aiModel?: string
  }>
  synopsis: string
  fullDescription?: string
  excerpt?: string
  pageCount?: number
  language: string
  formats: {
    epub?: {
      fileUrl: string
      fileSize: number
    }
    pdf?: {
      fileUrl: string
      fileSize: number
    }
    mobi?: {
      fileUrl: string
      fileSize: number
    }
  }
  cover: {
    original: string
    large?: string
    medium?: string
    small?: string
    thumbnail?: string
  }
  pricing: {
    base: number
    currency: string
  }
  aiGeneration?: {
    textModel?: string
    textPrompt?: string
    coverModel?: string
    coverPrompt?: string
    generatedAt?: string
  }
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  featured: boolean
  stats: {
    views: number
    downloads: number
    rating: number
    reviews: number
    totalRatings: number
  }
  tags: string[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface BooksResponse {
  success: boolean
  data: Book[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface BookParams {
  genre?: string
  status?: 'draft' | 'published' | 'archived' | 'all'
  featured?: boolean
  search?: string
  sort?: string
  page?: number
  limit?: number
}

class BookService {
  private baseUrl = '/api/books'

  /**
   * Obtener libros con filtros
   */
  async getAll(params?: BookParams): Promise<BooksResponse> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.genre) queryParams.append('genre', params.genre)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.featured !== undefined) queryParams.append('featured', String(params.featured))
      if (params?.search) queryParams.append('search', params.search)
      if (params?.sort) queryParams.append('sort', params.sort)
      if (params?.page) queryParams.append('page', String(params.page))
      if (params?.limit) queryParams.append('limit', String(params.limit))
      
      const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Error al cargar libros')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error en getAll:', error)
      throw error
    }
  }

  /**
   * Obtener un libro por ID o slug
   */
  async getOne(idOrSlug: string): Promise<Book> {
    try {
      const response = await fetch(`${this.baseUrl}/${idOrSlug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Libro no encontrado')
        }
        throw new Error('Error al cargar el libro')
      }
      
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error en getOne:', error)
      throw error
    }
  }

  /**
   * Obtener libros destacados
   */
  async getFeatured(limit: number = 6): Promise<Book[]> {
    const response = await this.getAll({
      featured: true,
      status: 'published',
      limit,
      sort: '-publishedAt'
    })
    return response.data
  }

  /**
   * Obtener libros por género
   */
  async getByGenre(genreCode: string, params?: Omit<BookParams, 'genre'>): Promise<BooksResponse> {
    return this.getAll({
      ...params,
      genre: genreCode,
      status: params?.status || 'published'
    })
  }

  /**
   * Buscar libros
   */
  async search(query: string, params?: Omit<BookParams, 'search'>): Promise<BooksResponse> {
    return this.getAll({
      ...params,
      search: query,
      status: params?.status || 'published'
    })
  }

  /**
   * Crear un nuevo libro (admin)
   */
  async create(book: Partial<Book>): Promise<Book> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al crear libro')
    }

    const data = await response.json()
    return data.data
  }

  /**
   * Actualizar un libro (admin)
   */
  async update(id: string, updates: Partial<Book>): Promise<Book> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al actualizar libro')
    }

    const data = await response.json()
    return data.data
  }

  /**
   * Eliminar un libro (admin)
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al eliminar libro')
    }
  }

  /**
   * Incrementar vistas (se hace automáticamente al obtener un libro)
   */
  async incrementViews(id: string): Promise<void> {
    // Este método es solo para referencia, las vistas se incrementan
    // automáticamente cuando se llama a getOne()
  }

  /**
   * Obtener precio formateado
   */
  formatPrice(priceInCents: number, currency: string = 'EUR'): string {
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    })
    return formatter.format(priceInCents / 100)
  }

  /**
   * Votar por un libro
   */
  async rateBook(bookId: string, rating: number): Promise<{
    success: boolean
    rating: number
    totalRatings: number
    userRating: number
    message: string
  }> {
    const response = await fetch(`${this.baseUrl}/${bookId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al votar')
    }

    return await response.json()
  }

  /**
   * Verificar si el usuario ya votó un libro
   */
  async checkUserRating(bookId: string): Promise<{
    hasRated: boolean
    userRating: number | null
  }> {
    const response = await fetch(`${this.baseUrl}/${bookId}/rate`)

    if (!response.ok) {
      console.error('Error al verificar voto')
      return { hasRated: false, userRating: null }
    }

    return await response.json()
  }
}

// Exportar instancia única (singleton)
export const bookService = new BookService()
