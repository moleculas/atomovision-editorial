import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Book from '@/lib/mongodb/models/Book'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectMongoose()
    
    const book = await Book.findOne({ 
      slug: params.slug, 
      status: 'published' 
    })
      .populate('genre')
      .lean()
    
    if (!book) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Libro no encontrado' 
        },
        { status: 404 }
      )
    }
    
    // Castear book a any para evitar problemas de tipos
    const bookData = book as any
    
    // Función helper para construir URLs completas
    const buildFileUrl = (path: string | undefined, type: 'epubs' | 'portadas'): string => {
      if (!path) return ''
      const filesBaseUrl = process.env.NEXT_PUBLIC_FILES_BASE_URL || 'https://anomaliagravitatoria.net/atomovision'
      
      // Si ya es una URL completa, devolverla tal cual
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path
      }
      
      // Si es una ruta local o solo el nombre del archivo
      if (path.startsWith('/')) {
        return `${filesBaseUrl}${path}`
      }
      
      return `${filesBaseUrl}/${path}`
    }
    
    // Transformar los datos para el frontend
    const transformedBook = {
      id: bookData._id.toString(),
      slug: bookData.slug,
      title: bookData.title,
      subtitle: bookData.subtitle || undefined,
      author: bookData.authors?.[0]?.name || 'Autor desconocido',
      synopsis: bookData.synopsis,
      category: bookData.genre?.name || '',
      categorySlug: bookData.genre?.code || '',
      tags: bookData.tags || [],
      themes: bookData.seo?.keywords || [],
      coverImage: buildFileUrl(bookData.cover?.original, 'portadas') || '/textures/book-cover-1.jpg',
      price: bookData.pricing?.base || 0,
      currency: bookData.pricing?.currency || 'EUR',
      formats: {
        ebook: bookData.formats?.epub ? true : false,
        paperback: bookData.formats?.pdf ? true : false,
        hardcover: false
      },
      inventory: 100, // Por ahora siempre disponible
      sku: bookData.registroAtomoVision || '',
      isbn: bookData.isbn,
      publicationDate: bookData.publishedAt || bookData.createdAt,
      language: bookData.language || 'es',
      pageCount: bookData.pageCount || 0,
      featured: bookData.featured || false,
      rating: bookData.stats?.rating || undefined,
      totalRatings: bookData.stats?.totalRatings || 0,
      epubFile: buildFileUrl(bookData.formats?.epub?.fileUrl, 'epubs'),
      pdfFile: buildFileUrl(bookData.formats?.pdf?.fileUrl, 'epubs'),
      preview: bookData.excerpt,
      fullDescription: bookData.fullDescription,
      aiTextModel: bookData.aiGeneration?.textModel,
      aiImageModel: bookData.aiGeneration?.coverModel,
      metaTitle: bookData.seo?.metaTitle,
      metaDescription: bookData.seo?.metaDescription,
      ogImage: buildFileUrl(bookData.cover?.large || bookData.cover?.original, 'portadas'),
    }
    
    return NextResponse.json({
      success: true,
      data: transformedBook
    })
    
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener el libro',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
