// Función para asegurar que todos los modelos están registrados
export function ensureModelsAreRegistered() {
  try {
    // Importar todos los modelos para asegurarse de que están registrados
    require('./Genre')
    require('./Book')
    require('./User')
    require('./Collection')
    require('./Purchase')
    require('./Rating')
    require('./HomeSettings')
  } catch (error) {
    console.error('Error registrando modelos:', error)
  }
}
