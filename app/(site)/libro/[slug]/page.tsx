import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getBookBySlug } from '@/lib/cms'
import { generateBookMetadata, generateBookSchema } from '@/lib/seo'
import { BookDetail } from '@/components/ui/BookDetail'

// Forzar renderizado dinámico para evitar problemas de caché
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Props {
  params: {
    slug: string
  }
}

// Función helper para obtener libro con reintentos
async function getBookWithRetries(slug: string, maxRetries = 3) {
  let retries = 0
  let lastError = null
  
  while (retries < maxRetries) {
    try {
      const book = await getBookBySlug(slug)
      if (book) return book
      
      // Si no hay libro pero no hay error, es un 404 real
      if (retries === 0) {
        return null
      }
    } catch (error) {
      console.error(`Error obteniendo libro (intento ${retries + 1}/${maxRetries}):`, error)
      lastError = error
    }
    
    retries++
    if (retries < maxRetries) {
      // Esperar antes de reintentar (backoff exponencial)
      await new Promise(resolve => setTimeout(resolve, 1000 * retries))
    }
  }
  
  // Si llegamos aquí, todos los reintentos fallaron
  console.error('Todos los reintentos fallaron:', lastError)
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBookWithRetries(params.slug)
  if (!book) return {}
  
  return generateBookMetadata(book)
}

export default async function BookPage({ params }: Props) {
  const book = await getBookWithRetries(params.slug)

  if (!book) {
    notFound()
  }

  const bookSchema = generateBookSchema(book)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />
      <BookDetail book={book} />
    </>
  )
}
