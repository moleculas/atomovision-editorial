import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'
import Book from '@/lib/mongodb/models/Book'
import { readFile } from 'fs/promises'
import path from 'path'

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

    // Construir la ruta del archivo EPUB
    const fileName = `${book.slug}.epub`
    const filePath = path.join(process.cwd(), 'public', 'libros', 'epubs', fileName)

    try {
      // Leer el archivo
      const fileBuffer = await readFile(filePath)

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
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })

      // Retornar el archivo
      return new NextResponse(fileBuffer as unknown as BodyInit, {
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
