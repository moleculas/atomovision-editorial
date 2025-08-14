import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get('file')
  
  if (!fileName) {
    return NextResponse.json({ error: 'No file specified' }, { status: 400 })
  }
  
  try {
    // Construir la URL del archivo en el repositorio externo
    const fileUrl = `https://anomaliagravitatoria.net/repositorio/assets/images/archillect/${fileName}`
    
    // Hacer la petición al servidor externo
    const response = await fetch(fileUrl)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    
    // Obtener el contenido del archivo
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const buffer = await response.arrayBuffer()
    
    // Devolver el archivo con los headers CORS apropiados
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error fetching file:', error)
    return NextResponse.json({ error: 'Error fetching file' }, { status: 500 })
  }
}
