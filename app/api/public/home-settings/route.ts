import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import HomeSettings from '@/lib/mongodb/models/HomeSettings'
import { ensureModelsAreRegistered } from '@/lib/mongodb/models'

// Función helper para construir URLs completas
function buildFileUrl(path: string | undefined, type: 'epubs' | 'portadas'): string {
  if (!path) return ''
  const filesBaseUrl = process.env.NEXT_PUBLIC_FILES_BASE_URL || 'https://anomaliagravitatoria.net/atomovision/libros'
  
  // Si ya es una URL completa, devolverla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Si es una ruta local o solo el nombre del archivo
  if (path.startsWith('/')) {
    return `${filesBaseUrl}${path}`
  }
  
  return `${filesBaseUrl}/${type}/${path}`
}

// Función para transformar el libro al formato esperado por el frontend
function transformBookForFrontend(book: any) {
  if (!book) return null
  
  return {
    id: book._id.toString(),
    _id: book._id.toString(), // Por compatibilidad
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle,
    authors: book.authors?.map((a: any) => typeof a === 'string' ? a : a.name) || [],
    synopsis: book.synopsis,
    description: book.synopsis, // Alias
    coverImage: {
      url: buildFileUrl(book.cover?.original, 'portadas') || '/textures/book-cover-1.jpg',
      alt: `Portada de ${book.title}`,
    },
    price: book.pricing?.base || 0,
    pricing: book.pricing, // Mantener también el objeto original
    currency: book.pricing?.currency || 'EUR',
    formats: {
      ebook: book.formats?.epub ? true : false,
      paperback: book.formats?.pdf ? true : false,
      hardcover: false
    },
    genre: book.genre, // Objeto completo del género
    pageCount: book.pageCount || 0,
    registroAtomoVision: book.registroAtomoVision || '',
    language: book.language || 'es',
    featured: book.featured || false,
    rating: book.stats?.rating || 0,
    totalRatings: book.stats?.totalRatings || 0,
    aiGeneration: book.aiGeneration,
    aiModel: book.aiGeneration?.textModel, // Por compatibilidad
    coverAiModel: book.aiGeneration?.coverModel, // Por compatibilidad
    n8nConfig: book.n8nConfig, // Añadir configuración N8N
  }
}

// GET - Obtener configuración pública de la home
export async function GET(request: NextRequest) {
  try {
    await connectMongoose()
    
    // Asegurar que todos los modelos estén registrados
    ensureModelsAreRegistered()

    // Buscar la configuración
    const settings = await HomeSettings.findOne()
      .populate({
        path: 'featuredBookId',
        populate: {
          path: 'genre'
        }
      })
      .lean() as any // Convertir a objeto plano para evitar problemas de serialización
    
    if (!settings) {
      // Retornar configuración por defecto
      return NextResponse.json({ 
        settings: {
          featuredBookId: null,
          headerTitle: 'AtomoVisión',
          headerDescription: 'AtomoVisión es una editorial digital que utiliza inteligencia artificial para crear libros únicos de ciencia ficción y fantasía. Cada obra es una experiencia literaria original que explora nuevos mundos e historias.',
          chatQuestions: {
            question1: '¿Cuáles son los secretos mejor guardados de este mundo?',
            question2: '¿Qué fuerzas o poderes mueven este universo?',
            question3: '¿Cómo era este mundo antes de que comenzara la historia?',
            question4: 'Ponte en la piel del protagonista'
          }
        }
      })
    }

    // Transformar el libro destacado si existe
    const transformedSettings = {
      ...settings,
      featuredBookId: transformBookForFrontend(settings?.featuredBookId)
    }

    return NextResponse.json({ settings: transformedSettings })
  } catch (error) {
    console.error('Error al obtener configuración de home:', error)
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}
