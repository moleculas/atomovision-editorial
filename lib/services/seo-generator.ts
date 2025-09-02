/**
 * Servicio para generar automáticamente metadata SEO para libros
 */

interface SeoGeneratorInput {
  title: string
  subtitle?: string
  genre: string
  synopsis: string
  tags: string[]
  authors: Array<{ name: string }>
}

export class SeoGenerator {
  /**
   * Genera un meta title optimizado para SEO
   */
  static generateMetaTitle(input: SeoGeneratorInput): string {
    const { title, subtitle, genre } = input
    
    // Plantillas de título (máximo 60 caracteres idealmente)
    const templates = [
      subtitle ? `${title}: ${subtitle} | ${genre} IA` : `${title} | Libro ${genre} IA`,
      `${title} | ${genre} generado por IA | AtomoVisión`,
      `${title} - ${genre} | AtomoVisión`,
    ]
    
    // Buscar la primera plantilla que no exceda 70 caracteres
    for (const template of templates) {
      if (template.length <= 70) {
        return template
      }
    }
    
    // Si todas son muy largas, usar la más básica
    return `${title} | AtomoVisión`
  }
  
  /**
   * Genera una meta description optimizada
   */
  static generateMetaDescription(input: SeoGeneratorInput): string {
    const { synopsis, genre, authors } = input
    
    // Limpiar sinopsis de saltos de línea y espacios múltiples
    const cleanSynopsis = synopsis
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Si la sinopsis es corta, usarla completa
    if (cleanSynopsis.length <= 140) {
      return `${cleanSynopsis} Libro de ${genre} generado por IA.`
    }
    
    // Si es larga, cortar en el último punto antes de 140 caracteres
    const maxLength = 140
    let description = cleanSynopsis.substring(0, maxLength)
    const lastPeriod = description.lastIndexOf('.')
    
    if (lastPeriod > 80) {
      description = description.substring(0, lastPeriod + 1)
    } else {
      // Si no hay punto, cortar en el último espacio
      const lastSpace = description.lastIndexOf(' ')
      description = description.substring(0, lastSpace) + '...'
    }
    
    return `${description} ${genre} por ${authors[0]?.name || 'IA'}.`
  }
  
  /**
   * Genera keywords relevantes para el libro
   */
  static generateKeywords(input: SeoGeneratorInput): string[] {
    const { title, genre, tags } = input
    
    // Keywords base
    const baseKeywords = [
      'libro IA',
      'novela generada IA',
      'inteligencia artificial literatura',
      'AtomoVisión',
    ]
    
    // Keywords del género
    const genreKeywords = [
      genre.toLowerCase(),
      `libro ${genre.toLowerCase()}`,
      `novela ${genre.toLowerCase()}`,
      `${genre.toLowerCase()} IA`,
    ]
    
    // Keywords del título (palabras clave principales)
    const titleWords = title
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3) // Solo palabras de más de 3 letras
      .filter(word => !['para', 'como', 'este', 'esta', 'esos'].includes(word)) // Excluir palabras comunes
    
    // Combinar todas las keywords
    const allKeywords = [
      ...new Set([ // Usar Set para eliminar duplicados
        ...baseKeywords,
        ...genreKeywords,
        ...tags.map(tag => tag.toLowerCase()),
        ...titleWords,
      ])
    ]
    
    // Limitar a 10-12 keywords más relevantes
    return allKeywords.slice(0, 12)
  }
  
  /**
   * Genera el objeto SEO completo
   */
  static generateSeo(input: SeoGeneratorInput) {
    return {
      metaTitle: this.generateMetaTitle(input),
      metaDescription: this.generateMetaDescription(input),
      keywords: this.generateKeywords(input),
    }
  }
}
