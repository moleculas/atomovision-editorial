import type { MetadataRoute } from 'next'
import { getBooks } from '@/lib/cms'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://editorial3d.com'
  
  // Obtener todos los libros
  const books = await getBooks()
  
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
  
  // Páginas de libros
  const bookPages: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${baseUrl}/book/${book.slug}`,
    lastModified: new Date(book.releaseDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  
  return [...staticPages, ...bookPages]
}
