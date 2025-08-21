// import { mockBooks } from '../lib/cms'
// import { createProduct, createPrice } from '../lib/stripe'

// Script de seed desactualizado - usar MongoDB directamente
console.log('Este script necesita ser actualizado para usar MongoDB')
console.log('Usar: npm run seed:genres para cargar los géneros')

export {}

/*

async function seed() {
  console.log('🌱 Iniciando seed de datos...')

  // Verificar si Stripe está configurado
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('test_51234567890')) {
    console.log('⚠️  Stripe no está configurado. Usando datos mock.')
    console.log('📝 Para configurar Stripe:')
    console.log('   1. Crea una cuenta en https://stripe.com')
    console.log('   2. Obtén tus claves de API')
    console.log('   3. Actualiza el archivo .env.local')
    console.log('\n✅ El proyecto funcionará con datos de prueba.')
    return
  }

  try {
    // Crear productos en Stripe para cada libro
    for (const book of mockBooks) {
      console.log(`📚 Procesando: ${book.title}`)

      // Crear producto en Stripe
      const product = await createProduct({
        name: book.title,
        description: book.description_md.slice(0, 500),
        images: [book.coverImage.url],
        metadata: {
          bookId: book.id,
          authors: book.authors.join(', '),
        },
      })

      console.log(`✅ Producto creado: ${product.id}`)

      // Crear precio para cada formato disponible
      for (const [format, data] of Object.entries(book.formats)) {
        if (!data) continue

        const price = await createPrice({
          productId: product.id,
          unitAmount: book.price,
          currency: book.currency.toLowerCase(),
          metadata: {
            format,
            bookId: book.id,
          },
        })

        console.log(`💰 Precio creado para ${format}: ${price.id}`)
        
        // Aquí actualizarías el CMS con los IDs de Stripe
        // En producción, guardarías estos IDs en tu base de datos
        book.stripeProductId = product.id
        book.stripePriceId = price.id
      }
    }

    console.log('✨ Seed completado exitosamente!')
    
    // En producción, aquí actualizarías el CMS con los datos de Stripe
    console.log('\n📝 Nota: En producción, actualiza tu CMS con los siguientes IDs de Stripe:')
    mockBooks.forEach(book => {
      console.log(`- ${book.title}: Product ${book.stripeProductId}, Price ${book.stripePriceId}`)
    })

  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    process.exit(1)
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  seed()
}

export { seed }
*/
