import mongoose, { Schema, model, models } from 'mongoose'

export interface ICollection {
  _id?: string
  name: string
  slug: string
  description: string
  type: 'saga' | 'series' | 'anthology' | 'theme' | 'author'
  
  // Libros en la colección
  books: string[] // IDs de libros
  bookOrder: string[] // Orden específico de lectura (IDs)
  
  // Visuales
  coverImage?: string
  bannerImage?: string
  color?: string
  
  // Metadata
  featured: boolean
  active: boolean
  tags: string[]
  
  // Estadísticas
  stats: {
    bookCount: number
    totalViews: number
    totalSales: number
  }
  
  createdAt?: Date
  updatedAt?: Date
}

const collectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    
    type: {
      type: String,
      required: true,
      enum: ['saga', 'series', 'anthology', 'theme', 'author'],
    },
    
    books: [{
      type: Schema.Types.ObjectId,
      ref: 'Book',
    }],
    
    bookOrder: [{
      type: Schema.Types.ObjectId,
      ref: 'Book',
    }],
    
    coverImage: String,
    bannerImage: String,
    color: {
      type: String,
      default: '#6495ED',
    },
    
    featured: {
      type: Boolean,
      default: false,
    },
    
    active: {
      type: Boolean,
      default: true,
    },
    
    tags: [String],
    
    stats: {
      bookCount: {
        type: Number,
        default: 0,
      },
      totalViews: {
        type: Number,
        default: 0,
      },
      totalSales: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
)

// Índices
collectionSchema.index({ slug: 1 })
collectionSchema.index({ type: 1 })
collectionSchema.index({ featured: 1 })
collectionSchema.index({ active: 1 })
collectionSchema.index({ name: 'text', description: 'text' })

// Middleware para actualizar el contador de libros
collectionSchema.pre('save', function(next) {
  if (this.isModified('books')) {
    this.stats.bookCount = this.books.length
  }
  next()
})

// Método para añadir un libro
collectionSchema.methods.addBook = async function(bookId: string, position?: number) {
  if (!this.books.includes(bookId)) {
    if (position !== undefined && position >= 0 && position <= this.books.length) {
      this.books.splice(position, 0, bookId)
      this.bookOrder.splice(position, 0, bookId)
    } else {
      this.books.push(bookId)
      this.bookOrder.push(bookId)
    }
    this.stats.bookCount = this.books.length
    return await this.save()
  }
  return this
}

// Método para eliminar un libro
collectionSchema.methods.removeBook = async function(bookId: string) {
  this.books = this.books.filter((id: any) => id.toString() !== bookId)
  this.bookOrder = this.bookOrder.filter((id: any) => id.toString() !== bookId)
  this.stats.bookCount = this.books.length
  return await this.save()
}

// Método para reordenar libros
collectionSchema.methods.reorderBooks = async function(newOrder: string[]) {
  // Verificar que todos los IDs en newOrder estén en books
  const bookIds = this.books.map((id: any) => id.toString())
  const validOrder = newOrder.every(id => bookIds.includes(id))
  
  if (validOrder && newOrder.length === this.books.length) {
    this.bookOrder = newOrder
    return await this.save()
  }
  
  throw new Error('Invalid book order')
}

// Virtual para URL
collectionSchema.virtual('url').get(function() {
  return `/coleccion/${this.slug}`
})

const Collection = models.Collection || model<ICollection>('Collection', collectionSchema)

export default Collection
