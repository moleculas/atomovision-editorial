// Wrapper para cargar el listado de archivos de Archillect
// Este archivo permite importar el listado sin modificar el archivo original

// Función para cargar el listado dinámicamente
export async function loadArchillectFiles(): Promise<string[]> {
  try {
    // Importar el archivo listado.js
    const response = await fetch('/constants/listado.js')
    const text = await response.text()

    // Extraer el array usando una expresión regular
    const match = text.match(/const\s+archivos\s*=\s*\[([\s\S]*?)\]/)
    if (match) {
      // Evaluar el array de forma segura
      const arrayContent = match[1]
      const files = arrayContent.split(',').map(f => f.trim().replace(/['"]/g, ''))
      return files.filter(f => f.length > 0)
    }
  } catch (error) {
    console.error('Error cargando listado de archivos:', error)
  }

  return []
}

// Cargar archivos al inicio
let cachedFiles: string[] = []

export async function getArchillectFiles(): Promise<string[]> {
  if (cachedFiles.length === 0) {
    cachedFiles = await loadArchillectFiles()
  }
  return cachedFiles
}
