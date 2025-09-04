import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, tag, secret } = body

    // Verificación básica de seguridad (opcional)
    const validSecret = process.env.REVALIDATION_SECRET || 'atomovision-revalidate-2025'
    if (secret && secret !== validSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    // Revalidar por path
    if (path) {
      revalidatePath(path)
      console.log(`Revalidated path: ${path}`)
    }

    // Revalidar por tag (opcional, para futuro)
    if (tag) {
      revalidateTag(tag)
      console.log(`Revalidated tag: ${tag}`)
    }

    // También revalidar paths relacionados
    if (path && path.startsWith('/libro/')) {
      revalidatePath('/') // Home
      revalidatePath('/catalog') // Catálogo
      revalidatePath('/busqueda') // Búsqueda
    }

    return NextResponse.json({ 
      success: true, 
      revalidated: true,
      path,
      tag,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in revalidation:', error)
    return NextResponse.json(
      { 
        error: 'Error revalidating',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// También permitir GET para pruebas manuales
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get('path')
  const secret = searchParams.get('secret')

  if (!path) {
    return NextResponse.json({ error: 'Path required' }, { status: 400 })
  }

  // Reutilizar la lógica del POST
  return POST(new NextRequest(request.url, {
    method: 'POST',
    body: JSON.stringify({ path, secret })
  }))
}
