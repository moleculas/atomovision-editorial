// Script para limpiar todas las compras de la base de datos
require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

async function cleanPurchases() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Conectado a MongoDB')
    
    // Obtener el modelo Purchase
    const Purchase = mongoose.model('Purchase', new mongoose.Schema({}, { strict: false }))
    
    // Contar compras actuales
    const count = await Purchase.countDocuments()
    console.log(`Compras encontradas: ${count}`)
    
    if (count > 0) {
      // Eliminar todas las compras
      const result = await Purchase.deleteMany({})
      console.log(`✅ ${result.deletedCount} compras eliminadas`)
    } else {
      console.log('No hay compras para eliminar')
    }
    
    // Cerrar conexión
    await mongoose.connection.close()
    console.log('Conexión cerrada')
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

cleanPurchases()
