// Servicio para obtener géneros desde la API

export interface Genre {
  id: string
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
    return data || []
  } catch (error) {
    console.error('Error fetching genres:', error)
    return []
  }
}
