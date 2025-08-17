// Servicio para interactuar con la API de géneros

export interface Genre {
  _id: string
  code: string
  name: string
  description?: string
  parentGenre?: string
  color?: string
  icon?: string
  order: number
  bookCount: number
  featured: boolean
  metadata?: {
    keywords: string[]
    relatedGenres: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface GenresResponse {
  success: boolean
  count: number
  data: Genre[]
}

class GenreService {
  private baseUrl = '/api/genres'

  /**
   * Obtener todos los géneros
   */
  async getAll(params?: {
    featured?: boolean
    parent?: string
    sort?: 'order' | 'name'
  }): Promise<Genre[]> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.featured !== undefined) {
        queryParams.append('featured', String(params.featured))
      }
      if (params?.parent) {
        queryParams.append('parent', params.parent)
      }
      if (params?.sort) {
        queryParams.append('sort', params.sort)
      }
      
      const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Error al cargar géneros')
      }
      
      const data: GenresResponse = await response.json()
      return data.data
    } catch (error) {
      console.error('Error en getAll:', error)
      throw error
    }
  }

  /**
   * Obtener géneros destacados
   */
  async getFeatured(): Promise<Genre[]> {
    return this.getAll({ featured: true })
  }

  /**
   * Obtener subgéneros de un género padre
   */
  async getSubgenres(parentCode: string): Promise<Genre[]> {
    return this.getAll({ parent: parentCode })
  }

  /**
   * Buscar género por código
   */
  async getByCode(code: string): Promise<Genre | null> {
    const genres = await this.getAll()
    return genres.find(g => g.code === code) || null
  }

  /**
   * Crear un nuevo género (admin)
   */
  async create(genre: Partial<Genre>): Promise<Genre> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(genre),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al crear género')
    }

    const data = await response.json()
    return data.data
  }
}

// Exportar instancia única (singleton)
export const genreService = new GenreService()
