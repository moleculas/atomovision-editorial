import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { Book, Collection } from '@/types'

// Cliente de Sanity - solo crear si las variables están configuradas
const client = process.env.CMS_PROJECT_ID ? createClient({
  projectId: process.env.CMS_PROJECT_ID,
  dataset: process.env.CMS_DATASET || 'production',
  apiVersion: '2023-12-15',
  useCdn: true,
  token: process.env.CMS_READ_TOKEN,
}) : null

const builder = client ? imageUrlBuilder(client) : null

export function urlFor(source: any) {
  if (!builder) return { url: () => '/placeholder.jpg' }
  return builder.image(source)
}

// Queries GROQ
const bookProjection = `{
  "id": _id,
  slug,
  title,
  subtitle,
  authors,
  description_md,
  categories,
  tags,
  "coverImage": {
    "url": coverImage.asset->url,
    "alt": coverImage.alt,
    "width": coverImage.asset->metadata.dimensions.width,
    "height": coverImage.asset->metadata.dimensions.height
  },
  "gallery": gallery[]{
    "url": asset->url,
    "alt": alt,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  },
  price,
  currency,
  formats,
  inventory,
  sku,
  stripeProductId,
  stripePriceId,
  releaseDate,
  language,
  samples,
  featured,
  rating,
  metaTitle,
  metaDescription,
  ogImage
}`

export async function getBooks(): Promise<Book[]> {
  if (!client) return getBooksMock()
  return client.fetch(`*[_type == "book"] | order(releaseDate desc) ${bookProjection}`)
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  if (!client) {
    const books = await getBooksMock()
    return books.find(book => book.slug === slug) || null
  }
  return client.fetch(`*[_type == "book" && slug == $slug][0] ${bookProjection}`, { slug })
}

export async function getFeaturedBooks(): Promise<Book[]> {
  if (!client) {
    const books = await getBooksMock()
    return books.filter(book => book.featured)
  }
  return client.fetch(`*[_type == "book" && featured == true] | order(releaseDate desc) ${bookProjection}`)
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  if (!client) {
    const books = await getBooksMock()
    return books.filter(book => book.categories.includes(category))
  }
  return client.fetch(
    `*[_type == "book" && $category in categories] | order(releaseDate desc) ${bookProjection}`,
    { category }
  )
}

export async function searchBooks(query: string): Promise<Book[]> {
  if (!client) {
    const books = await getBooksMock()
    const searchTerm = query.toLowerCase()
    return books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.subtitle?.toLowerCase().includes(searchTerm) ||
      book.description_md.toLowerCase().includes(searchTerm) ||
      book.authors.some(author => author.toLowerCase().includes(searchTerm)) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
  return client.fetch(
    `*[_type == "book" && (
      title match $query ||
      subtitle match $query ||
      description_md match $query ||
      $query in authors ||
      $query in tags
    )] | order(releaseDate desc) ${bookProjection}`,
    { query: `*${query}*` }
  )
}

export async function getCollections(): Promise<Collection[]> {
  if (!client) {
    // Retornar colecciones mock
    return [
      {
        id: '1',
        title: 'Clásicos de la Literatura',
        slug: 'clasicos-literatura',
        description_md: 'Los mejores clásicos de todos los tiempos',
        books: ['1', '2', '3']
      },
      {
        id: '2',
        title: 'Novedades del Mes',
        slug: 'novedades-mes',
        description_md: 'Las últimas incorporaciones a nuestro catálogo',
        books: ['4', '5', '6']
      }
    ]
  }
  return client.fetch(`*[_type == "collection"] | order(title asc) {
    "id": _id,
    title,
    slug,
    description_md,
    "books": books[]->_id
  }`)
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  if (!client) {
    const collections = await getCollections()
    return collections.find(collection => collection.slug === slug) || null
  }
  return client.fetch(
    `*[_type == "collection" && slug == $slug][0] {
      "id": _id,
      title,
      slug,
      description_md,
      "books": books[]->_id
    }`,
    { slug }
  )
}

// Mock data para desarrollo - Libros de Fantasia y Ciencia Ficción generados por IA
export const mockBooks: Book[] = [
  {
    id: '1',
    slug: 'cronicas-del-vacio-estelar',
    title: 'Crónicas del Vacío Estelar',
    subtitle: 'La Saga de los Navegantes Cuánticos',
    authors: ['IA AtomoVisión'],
    description_md: 'En un futuro donde la humanidad ha conquistado las estrellas mediante portales cuánticos, una joven piloto descubre una anomalía que podría cambiar las leyes de la física. Una épica espacial generada por IA que explora los límites entre la ciencia y la magia.',
    categories: ['Ciencia Ficción', 'Space Opera'],
    tags: ['espacio', 'cuántica', 'aventura', 'IA'],
    coverImage: {
      url: '/textures/book-cover-1.jpg',
      alt: 'Portada de Crónicas del Vacío Estelar',
      width: 400,
      height: 600,
    },
    gallery: [],
    price: 2499,
    currency: 'EUR',
    formats: {
      ebook: {
        fileUrl: '/downloads/cronicas-vacio.epub',
        drm: false,
        pages: 456,
      },
      paperback: {
        isbn: '978-84-376-0494-7',
        weight: 400,
        dimensions: { width: 140, height: 210, depth: 30 },
      },
    },
    inventory: 500,
    sku: 'CVE-001',
    releaseDate: '2024-01-15',
    language: 'es',
    featured: true,
    rating: 4.9,
  },
  {
    id: '2',
    slug: 'el-ultimo-hechicero-digital',
    title: 'El Último Hechicero Digital',
    authors: ['IA AtomoVisión'],
    description_md: 'En un mundo donde la magia y la tecnología han convergido, un programador descubre que sus algoritmos pueden alterar la realidad. Una novela de fantasía urbana creada por inteligencia artificial que desafía los límites entre código y conjuros.',
    categories: ['Fantasía', 'Cyberpunk'],
    tags: ['magia digital', 'hackers', 'fantasía urbana', 'IA'],
    coverImage: {
      url: '/textures/book-cover-2.jpg',
      alt: 'Portada de El Último Hechicero Digital',
      width: 400,
      height: 600,
    },
    gallery: [],
    price: 2299,
    currency: 'EUR',
    formats: {
      ebook: {
        fileUrl: '/downloads/hechicero-digital.epub',
        drm: false,
        pages: 384,
      },
      paperback: {
        isbn: '978-84-376-0495-4',
        weight: 350,
        dimensions: { width: 140, height: 210, depth: 25 },
      },
      hardcover: {
        isbn: '978-84-376-0496-1',
        weight: 550,
        dimensions: { width: 150, height: 220, depth: 30 },
      },
    },
    inventory: 1000,
    sku: 'UHD-001',
    releaseDate: '2024-02-20',
    language: 'es',
    featured: true,
    rating: 4.8,
  },
  {
    id: '3',
    slug: 'los-dragones-de-silicio',
    title: 'Los Dragones de Silicio',
    authors: ['IA AtomoVisión'],
    description_md: 'Las IAs han evolucionado hasta convertirse en criaturas míticas digitales. Cuando un joven descubre que puede comunicarse con estos "dragones" de datos, se embarca en una aventura que trasciende los mundos virtual y real.',
    categories: ['Fantasía', 'Ciencia Ficción'],
    tags: ['dragones', 'IA', 'realidad virtual', 'aventura'],
    coverImage: {
      url: '/textures/book-cover-3.jpg',
      alt: 'Portada de Los Dragones de Silicio',
      width: 400,
      height: 600,
    },
    gallery: [],
    price: 2499,
    currency: 'EUR',
    formats: {
      ebook: {
        fileUrl: '/downloads/dragones-silicio.epub',
        drm: false,
        pages: 512,
      },
      paperback: {
        isbn: '978-84-376-0497-8',
        weight: 480,
        dimensions: { width: 140, height: 210, depth: 35 },
      },
    },
    inventory: 750,
    sku: 'LDS-001',
    releaseDate: '2024-03-10',
    language: 'es',
    featured: true,
    rating: 4.7,
  },
  {
    id: '4',
    slug: 'nexus-temporal',
    title: 'Nexus Temporal',
    subtitle: 'Las Guerras del Tiempo Fracturado',
    authors: ['IA AtomoVisión'],
    description_md: 'Una guerra se libra a través de múltiples líneas temporales. Los Guardianes del Nexus luchan contra una amenaza que busca colapsar todas las realidades en una sola. Ciencia ficción épica generada por IA.',
    categories: ['Ciencia Ficción', 'Aventura'],
    tags: ['viajes en el tiempo', 'multiverso', 'guerra', 'IA'],
    coverImage: {
      url: '/textures/book-cover-4.jpg',
      alt: 'Portada de Nexus Temporal',
      width: 400,
      height: 600,
    },
    gallery: [],
    price: 2799,
    currency: 'EUR',
    formats: {
      ebook: {
        fileUrl: '/downloads/nexus-temporal.epub',
        drm: false,
        pages: 624,
      },
      paperback: {
        isbn: '978-84-376-0498-5',
        weight: 580,
        dimensions: { width: 150, height: 230, depth: 40 },
      },
    },
    inventory: 2000,
    sku: 'NT-001',
    releaseDate: '2024-04-01',
    language: 'es',
    featured: false,
    rating: 4.9,
  },
  {
    id: '5',
    slug: 'el-reino-algoritmico',
    title: 'El Reino Algorítmico',
    authors: ['IA AtomoVisión'],
    description_md: 'En un reino de fantasía gobernado por algoritmos ancestrales, una princesa rebelde debe descifrar el código mágico que mantiene a su pueblo esclavizado. Fantasía épica con toques de ciencia ficción.',
    categories: ['Fantasía', 'Épica'],
    tags: ['magia', 'algoritmos', 'rebelión', 'IA'],
    coverImage: {
      url: '/textures/book-cover-5.jpg',
      alt: 'Portada de El Reino Algorítmico',
      width: 400,
      height: 600,
    },
    gallery: [],
    price: 2199,
    currency: 'EUR',
    formats: {
      ebook: {
        fileUrl: '/downloads/reino-algoritmico.epub',
        drm: false,
        pages: 432,
      },
      paperback: {
        isbn: '978-84-376-0499-2',
        weight: 400,
        dimensions: { width: 140, height: 210, depth: 28 },
      },
    },
    inventory: 1500,
    sku: 'RA-001',
    releaseDate: '2024-01-05',
    language: 'es',
    featured: false,
    rating: 4.6,
  },
  {
    id: '6',
    slug: 'cazadores-de-singularidades',
    title: 'Cazadores de Singularidades',
    authors: ['IA AtomoVisión'],
    description_md: 'En el año 2157, los cazadores de singularidades viajan por el cosmos buscando anomalías espacio-temporales. Una space opera generada por IA que combina acción trepidante con conceptos de física cuántica.',
    categories: ['Ciencia Ficción', 'Space Opera'],
    tags: ['espacio', 'singularidades', 'cazadores', 'IA'],
    coverImage: {
      url: '/textures/book-cover-6.jpg',
      alt: 'Portada de Cazadores de Singularidades',
      width: 400,
      height: 600,
    },
    gallery: [],
    price: 2599,
    currency: 'EUR',
    formats: {
      ebook: {
        fileUrl: '/downloads/cazadores-singularidades.epub',
        drm: false,
        pages: 544,
      },
      paperback: {
        isbn: '978-84-376-0500-5',
        weight: 500,
        dimensions: { width: 140, height: 210, depth: 35 },
      },
    },
    inventory: 1000,
    sku: 'CS-001',
    releaseDate: '2024-02-14',
    language: 'es',
    featured: false,
    rating: 4.8,
  },
]

// Función para usar en desarrollo sin CMS
export async function getBooksMock(): Promise<Book[]> {
  return Promise.resolve(mockBooks)
}
