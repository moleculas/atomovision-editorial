const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

async function migrateGenres() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    const booksCollection = db.collection('books');
    
    // Buscar todos los libros donde genre es string
    const books = await booksCollection.find({
      genre: { $type: 'string' }
    }).toArray();
    
    console.log(`📚 Encontrados ${books.length} libros con género como string`);
    
    // Convertir cada uno
    for (const book of books) {
      if (book.genre && typeof book.genre === 'string') {
        console.log(`📖 Actualizando libro: ${book.title}`);
        console.log(`   Genre actual (string): ${book.genre}`);
        
        // Convertir string a ObjectId
        const genreObjectId = new mongoose.Types.ObjectId(book.genre);
        
        // Actualizar el documento
        await booksCollection.updateOne(
          { _id: book._id },
          { $set: { genre: genreObjectId } }
        );
        
        console.log(`   ✅ Convertido a ObjectId: ${genreObjectId}`);
      }
    }
    
    console.log('✅ Migración completada');
    
    // Verificar la migración
    const remaining = await booksCollection.countDocuments({
      genre: { $type: 'string' }
    });
    
    console.log(`📊 Libros restantes con género como string: ${remaining}`);
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar
migrateGenres();
