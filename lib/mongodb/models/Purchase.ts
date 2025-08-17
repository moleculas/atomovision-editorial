import mongoose, { Schema, model, models } from 'mongoose'

export interface IPurchase {
  _id?: string
  
  // Identificación
  purchaseCode: string // "ATV-P-202501-XXXXX"
  
  // Cliente (sin registro)
  customerEmail: string
  customerName?: string
  
  // Libro comprado
  bookId: string
  bookRegistroAtomoVision: string
  bookTitle: string
  format: 'epub' | 'pdf' | 'mobi'
  
  // Pago
  amount: number // en centavos
  currency: string
  stripePaymentIntentId: string
  stripeReceiptUrl?: string
  
  // Descarga
  downloadToken: string
  downloadUrl?: string
  downloadsAllowed: number
  downloadsUsed: number
  downloadHistory: Array<{
    downloadedAt: Date
    ipAddress: string
    userAgent?: string
  }>
  expiresAt: Date
  
  // Estado
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  
  // Timestamps
  createdAt?: Date
  updatedAt?: Date
}

const purchaseSchema = new Schema<IPurchase>(
  {
    purchaseCode: {
      type: String,
      required: true,
      unique: true,
    },
    
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    
    customerName: {
      type: String,
      trim: true,
    },
    
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    
    bookRegistroAtomoVision: {
      type: String,
      required: true,
    },
    
    bookTitle: {
      type: String,
      required: true,
    },
    
    format: {
      type: String,
      required: true,
      enum: ['epub', 'pdf', 'mobi'],
    },
    
    amount: {
      type: Number,
      required: true,
    },
    
    currency: {
      type: String,
      default: 'EUR',
    },
    
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    
    stripeReceiptUrl: String,
    
    downloadToken: {
      type: String,
      required: true,
      unique: true,
    },
    
    downloadUrl: String,
    
    downloadsAllowed: {
      type: Number,
      default: 3,
    },
    
    downloadsUsed: {
      type: Number,
      default: 0,
    },
    
    downloadHistory: [{
      downloadedAt: {
        type: Date,
        default: Date.now,
      },
      ipAddress: String,
      userAgent: String,
    }],
    
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000), // 7 días
    },
    
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'completed', 'failed', 'refunded'],
    },
  },
  {
    timestamps: true,
  }
)

// Índices
purchaseSchema.index({ purchaseCode: 1 })
purchaseSchema.index({ customerEmail: 1 })
purchaseSchema.index({ downloadToken: 1 })
purchaseSchema.index({ stripePaymentIntentId: 1 })
purchaseSchema.index({ status: 1, expiresAt: 1 })

// Método para verificar si puede descargar
purchaseSchema.methods.canDownload = function(): boolean {
  return this.status === 'completed' && 
         this.downloadsUsed < this.downloadsAllowed && 
         new Date() < this.expiresAt
}

// Método para registrar descarga
purchaseSchema.methods.recordDownload = async function(ipAddress: string, userAgent?: string) {
  if (!this.canDownload()) {
    throw new Error('Download not allowed')
  }
  
  this.downloadsUsed += 1
  this.downloadHistory.push({
    downloadedAt: new Date(),
    ipAddress,
    userAgent,
  })
  
  return await this.save()
}

const Purchase = models.Purchase || model<IPurchase>('Purchase', purchaseSchema)

export default Purchase
