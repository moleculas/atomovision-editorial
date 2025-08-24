// Servicio para obtener géneros desde la API

export interface Genre {
  id: string
  _id?: string  // MongoDB ID
  name: string
  code: string
  icon?: string
  color?: string
  bookCount: number
}

export async function getGenres(): Promise<Genre[]> {
  try {
    const response = await fetch('/api/genres', {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener los géneros')
    }
    
    const { data } = await response.json()
    
    // Mapear los datos para asegurar consistencia
    return (data || []).map((genre: any) => ({
      id: genre._id || genre.id,
      _id: genre._id,
      name: genre.name || '',
      code: genre.code || '',
      icon: genre.icon || '',
      color: genre.color || '#6495ED',
      bookCount: genre.bookCount || 0
    }))
  } catch (error) {
    console.error('Error fetching genres:', error)
    return []
  }
}
