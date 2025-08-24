// Función helper para asegurar que todos los modelos estén registrados
import Book from './models/Book'
import Genre from './models/Genre'
import User from './models/User'
import Collection from './models/Collection'
import Purchase from './models/Purchase'

export function ensureModelsAreRegistered() {
  // Solo importar los modelos es suficiente para registrarlos
  // pero los referenciamos para evitar tree-shaking
  const models = {
    Book,
    Genre,
    User,
    Collection,
    Purchase
  }
  
  return models
}
