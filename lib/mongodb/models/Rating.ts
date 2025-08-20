import mongoose, { Schema, model, models } from 'mongoose'

export interface IRating {
  _id?: string
  bookId: string
  identifier: string // IP o userID para evitar duplicados
  rating: number
  createdAt?: Date
}

const ratingSchema = new Schema<IRating>(
  {
    bookId: {
      type: String,
      required: true,
      ref: 'Book',
    },
    
    identifier: {
      type: String,
      required: true,
    },
    
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
)

// Índice único para evitar votos duplicados
ratingSchema.index({ bookId: 1, identifier: 1 }, { unique: true })

// Índice para consultas por libro
ratingSchema.index({ bookId: 1 })

const Rating = models.Rating || model<IRating>('Rating', ratingSchema)

export default Rating
