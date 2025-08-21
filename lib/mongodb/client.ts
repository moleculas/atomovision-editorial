import { MongoClient, Db, Collection, Document } from 'mongodb'
import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor define la variable MONGODB_URI en .env.local')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Para desarrollo - Cliente MongoDB nativo
if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usamos una variable global para preservar el valor
  // a través de recargas de módulos causadas por HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En producción, es mejor no usar una variable global.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Para Mongoose
const cached = global as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null }
}

async function connectMongoose() {
  if (cached.mongoose?.conn) {
    return cached.mongoose.conn
  }

  if (!cached.mongoose?.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.mongoose!.promise = mongoose.connect(uri!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.mongoose!.conn = await cached.mongoose!.promise
  } catch (e) {
    cached.mongoose!.promise = null
    throw e
  }

  return cached.mongoose!.conn
}

// Exportar ambos para flexibilidad
export default clientPromise
export { connectMongoose }

// Helper para obtener la base de datos
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db('atomovision')
}

// Helper para obtener una colección
export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDatabase()
  return db.collection<T>(name)
}
