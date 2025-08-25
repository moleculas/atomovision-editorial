import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'
import Book from '@/lib/mongodb/models/Book'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token
    const searchParams = request.nextUrl.searchParams
    const bookId = searchParams.get('book')

    if (!token || !bookId) {
      return NextResponse.json(
        { error: 'Token y libro son requeridos' },
        { status: 400 }
      )
    }

    await connectMongoose()

    // Buscar la compra por token
    const purchase = await Purchase.findOne({ 
      downloadToken: token,
      'items.book': bookId
    }).populate('items.book')

    if (!purchase) {
      return NextResponse.json(
        { error: 'Enlace de descarga no válido' },
        { status: 404 }
      )
    }

    // Verificar si puede descargar
    if (!purchase.canDownload()) {
      return NextResponse.json(
        { error: 'El enlace de descarga ha expirado o se ha alcanzado el límite de descargas' },
        { status: 403 }
      )
    }

    // Buscar el libro específico en los items
    const purchaseItem = purchase.items.find(
      (item: any) => item.book._id.toString() === bookId
    )

    if (!purchaseItem) {
      return NextResponse.json(
        { error: 'Libro no encontrado en esta compra' },
        { status: 404 }
      )
    }

    const book = purchaseItem.book

    // Construir la URL del archivo EPUB desde el servidor externo
    const filesBaseUrl = process.env.NEXT_PUBLIC_FILES_BASE_URL || 'https://anomaliagravitatoria.net/atomovision'
    let epubUrl = ''
    
    // Construir la URL según el formato guardado en la BD
    if (book.formats?.epub?.fileUrl) {
      const fileUrl = book.formats.epub.fileUrl
      
      if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
        // Ya es una URL completa
        epubUrl = fileUrl
      } else if (fileUrl.startsWith('/')) {
        // Es una ruta relativa tipo /libros/epubs/archivo.epub
        epubUrl = `${filesBaseUrl}${fileUrl}`
      } else {
        // Es solo el nombre del archivo
        epubUrl = `${filesBaseUrl}/libros/epubs/${fileUrl}`
      }
    } else {
      // Fallback: usar el slug
      epubUrl = `${filesBaseUrl}/libros/epubs/${book.slug}.epub`
    }

    console.log('URL del EPUB a descargar:', epubUrl)

    try {
      // Descargar el archivo desde el servidor externo
      const response = await fetch(epubUrl)
      
      if (!response.ok) {
        console.error('Error descargando archivo:', response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Obtener el archivo como ArrayBuffer
      const fileBuffer = await response.arrayBuffer()

      // Registrar la descarga
      const clientIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
      const userAgent = request.headers.get('user-agent') || 'unknown'
      
      await purchase.recordDownload(bookId, clientIp, userAgent)

      // Preparar headers para la descarga
      const headers = new Headers({
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': `attachment; filename="${book.title.replace(/[^a-z0-9]/gi, '_')}.epub"`,
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })

      // Retornar el archivo
      return new NextResponse(fileBuffer, {
        status: 200,
        headers,
      })
    } catch (fileError) {
      console.error('Error leyendo archivo:', fileError)
      return NextResponse.json(
        { error: 'El archivo no está disponible temporalmente' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error en descarga:', error)
    return NextResponse.json(
      { error: 'Error procesando la descarga' },
      { status: 500 }
    )
  }
}
