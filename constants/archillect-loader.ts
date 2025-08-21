// Importar el archivo original
const { archivos } = require('./listado.js')

// Re-exportar para uso en TypeScript
export const ARCHILLECT_FILES = archivos

// Información útil
export const ARCHILLECT_INFO = {
  totalFiles: archivos.length,
  hasVideos: archivos.some((f: string) => f.endsWith('.mp4')),
  hasImages: archivos.some((f: string) => f.endsWith('.jpg') || f.endsWith('.png')),
}

console.log(`Archivos Archillect cargados: ${archivos.length} archivos`)
