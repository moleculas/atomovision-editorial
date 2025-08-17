// Script para ejecutar el seed de géneros
// Ejecutar con: npm run seed:genres

import dotenv from 'dotenv'
import path from 'path'

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { seedGenres } from '../lib/mongodb/seeds/genres'

async function run() {
  try {
    console.log('🚀 Iniciando seed de géneros...')
    await seedGenres()
    console.log('✅ Seed completado exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    process.exit(1)
  }
}

run()
