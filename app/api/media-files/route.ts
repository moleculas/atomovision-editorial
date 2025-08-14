import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const mediaDir = path.join(process.cwd(), 'public', 'media')
    
    // Verificar si el directorio existe
    if (!fs.existsSync(mediaDir)) {
      return NextResponse.json([])
    }
    
    // Leer archivos del directorio
    const files = fs.readdirSync(mediaDir)
    
    // Filtrar solo archivos de imagen y video
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.mp4', '.webm', '.gif'].includes(ext)
    })
    
    return NextResponse.json(mediaFiles)
  } catch (error) {
    console.error('Error leyendo archivos:', error)
    return NextResponse.json([])
  }
}
