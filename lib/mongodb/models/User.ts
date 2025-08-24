import mongoose, { Schema, model, models } from 'mongoose'

export interface IUser {
  _id?: string
  email: string
  name: string
  password?: string // Solo si usamos auth local
  image?: string
  role: 'user' | 'admin'
  
  // Compras
  purchases: Array<{
    bookId: string
    registroAtomoVision: string
    format: string
    purchaseDate: Date
    price: number
    downloadUrl?: string
  }>
  
  // Listas
  favorites: string[] // IDs de libros
  readingList: string[] // IDs de libros
  
  // Preferencias
  preferences?: {
    favoriteGenres: string[]
    notifications: boolean
    newsletter: boolean
  }
  
  // Stripe
  stripeCustomerId?: string
  
  createdAt?: Date
  updatedAt?: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    password: {
      type: String,
      select: false, // No incluir por defecto en queries
    },
    
    image: String,
    
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    
    purchases: [{
      bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
      registroAtomoVision: {
        type: String,
        required: true,
      },
      format: {
        type: String,
        required: true,
        enum: ['epub', 'pdf', 'mobi'],
      },
      purchaseDate: {
        type: Date,
        default: Date.now,
      },
      price: {
        type: Number,
        required: true,
      },
      downloadUrl: String,
    }],
    
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: 'Book',
    }],
    
    readingList: [{
      type: Schema.Types.ObjectId,
      ref: 'Book',
    }],
    
    preferences: {
      favoriteGenres: [String],
      notifications: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: false,
      },
    },
    
    stripeCustomerId: String,
  },
  {
    timestamps: true,
  }
)

// Índices
// userSchema.index({ email: 1 }) // Ya definido con unique: true en el campo
userSchema.index({ 'purchases.bookId': 1 })
userSchema.index({ favorites: 1 })

// Método para verificar si el usuario ha comprado un libro
userSchema.methods.hasPurchased = function(bookId: string): boolean {
  return this.purchases.some((purchase: any) => 
    purchase.bookId.toString() === bookId
  )
}

// Método para añadir a favoritos
userSchema.methods.addToFavorites = async function(bookId: string) {
  if (!this.favorites.includes(bookId)) {
    this.favorites.push(bookId)
    return await this.save()
  }
  return this
}

// Método para eliminar de favoritos
userSchema.methods.removeFromFavorites = async function(bookId: string) {
  this.favorites = this.favorites.filter((id: any) => 
    id.toString() !== bookId
  )
  return await this.save()
}

// Virtual para obtener el número de libros comprados
userSchema.virtual('purchaseCount').get(function() {
  return this.purchases.length
})

const User = models.User || model<IUser>('User', userSchema)

export default User
