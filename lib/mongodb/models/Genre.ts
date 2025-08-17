import mongoose, { Schema, model, models } from 'mongoose'

export interface IGenre {
  _id?: string
  code: string
  name: string
  description?: string
  parentGenre?: string
  color?: string
  icon?: string
  order: number
  bookCount: number
  featured: boolean
  metadata?: {
    keywords: string[]
    relatedGenres: string[]
  }
  createdAt?: Date
  updatedAt?: Date
}

const genreSchema = new Schema<IGenre>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    parentGenre: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: '#6495ED', // Azul cobalto por defecto
    },
    icon: {
      type: String,
      default: '📚',
    },
    order: {
      type: Number,
      default: 0,
    },
    bookCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    metadata: {
      keywords: [{
        type: String,
      }],
      relatedGenres: [{
        type: String,
      }],
    },
  },
  {
    timestamps: true,
  }
)

// Índices para búsquedas eficientes
// El campo code ya tiene unique:true, no necesita índice adicional
genreSchema.index({ name: 'text' })
genreSchema.index({ order: 1 })

// Método para incrementar el contador de libros
genreSchema.methods.incrementBookCount = async function() {
  this.bookCount += 1
  return await this.save()
}

// Método para decrementar el contador de libros
genreSchema.methods.decrementBookCount = async function() {
  if (this.bookCount > 0) {
    this.bookCount -= 1
    return await this.save()
  }
}

// Evitar recompilar el modelo en desarrollo
const Genre = models.Genre || model<IGenre>('Genre', genreSchema)

export default Genre
