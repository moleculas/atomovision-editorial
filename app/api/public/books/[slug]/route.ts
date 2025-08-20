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
    
    // Transformar los datos para el frontend
    const transformedBook = {
      id: book._id.toString(),
      slug: book.slug,
      title: book.title,
      subtitle: book.subtitle || undefined,
      author: book.authors?.[0]?.name || 'Autor desconocido',
      synopsis: book.synopsis,
      category: book.genre?.name || '',
      categorySlug: book.genre?.code || '',
      tags: book.tags || [],
      themes: book.seo?.keywords || [],
      coverImage: book.cover?.original || '/textures/book-cover-1.jpg',
      price: book.pricing?.base || 0,
      currency: book.pricing?.currency || 'EUR',
      formats: {
        ebook: book.formats?.epub ? true : false,
        paperback: book.formats?.pdf ? true : false,
        hardcover: false
      },
      inventory: 100, // Por ahora siempre disponible
      sku: book.registroAtomoVision || '',
      isbn: book.isbn,
      publicationDate: book.publishedAt || book.createdAt,
      language: book.language || 'es',
      pageCount: book.pageCount || 0,
      featured: book.featured || false,
      rating: book.stats?.rating || undefined,
      totalRatings: book.stats?.totalRatings || 0,
      epubFile: book.formats?.epub?.fileUrl,
      pdfFile: book.formats?.pdf?.fileUrl,
      preview: book.excerpt,
      fullDescription: book.fullDescription,
      aiTextModel: book.aiGeneration?.textModel,
      aiImageModel: book.aiGeneration?.coverModel,
      metaTitle: book.seo?.metaTitle,
      metaDescription: book.seo?.metaDescription,
      ogImage: book.cover?.large || book.cover?.original,
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
