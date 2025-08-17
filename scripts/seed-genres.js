// Configurar las variables de entorno PRIMERO
require('dotenv').config({ path: '.env.local' })

// Verificar que MONGODB_URI está definida
if (!process.env.MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI no está definida en .env.local')
  console.error('Asegúrate de que .env.local contiene: MONGODB_URI=mongodb://127.0.0.1:27017/atomovision')
  process.exit(1)
}

console.log('✅ Variables de entorno cargadas')
console.log('📍 MongoDB URI:', process.env.MONGODB_URI)

// Ahora sí importar y ejecutar el seed
async function runSeed() {
  try {
    const { seedGenres } = await import('../lib/mongodb/seeds/genres')
    console.log('🚀 Iniciando seed de géneros...')
    await seedGenres()
    console.log('✅ Seed completado exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    process.exit(1)
  }
}

runSeed()
