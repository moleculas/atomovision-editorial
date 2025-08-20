import mongoose, { Schema, model, models } from 'mongoose'

export interface IPurchaseItem {
  book: mongoose.Types.ObjectId
  format: 'ebook' | 'paperback' | 'hardcover'
  quantity: number
  price: number // precio unitario en centavos
}

export interface IPurchase {
  _id?: string
  
  // Cliente
  email: string
  customerName?: string
  
  // Items del pedido
  items: IPurchaseItem[]
  
  // Totales
  totalAmount: number // en centavos
  currency: string
  
  // Stripe
  stripeSessionId?: string
  stripePaymentIntentId?: string
  stripeReceiptUrl?: string
  
  // Descarga
  downloadToken: string
  downloadExpiry: Date
  downloadCount: number
  downloadHistory: Array<{
    downloadedAt: Date
    ipAddress: string
    userAgent?: string
    bookId: string
  }>
  
  // Estado
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  
  // Timestamps
  createdAt?: Date
  updatedAt?: Date
}

const purchaseItemSchema = new Schema<IPurchaseItem>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    format: {
      type: String,
      required: true,
      enum: ['ebook', 'paperback', 'hardcover'],
      default: 'ebook',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
)

const purchaseSchema = new Schema<IPurchase>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    
    customerName: {
      type: String,
      trim: true,
    },
    
    items: {
      type: [purchaseItemSchema],
      required: true,
      validate: {
        validator: function(items: IPurchaseItem[]) {
          return items.length > 0
        },
        message: 'El pedido debe contener al menos un item',
      },
    },
    
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    
    currency: {
      type: String,
      default: 'EUR',
    },
    
    stripeSessionId: {
      type: String,
      sparse: true,
    },
    
    stripePaymentIntentId: {
      type: String,
      sparse: true,
    },
    
    stripeReceiptUrl: String,
    
    downloadToken: {
      type: String,
      required: true,
      unique: true,
    },
    
    downloadExpiry: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000), // 7 días
    },
    
    downloadCount: {
      type: Number,
      default: 0,
      max: 3, // máximo 3 descargas
    },
    
    downloadHistory: [{
      downloadedAt: {
        type: Date,
        default: Date.now,
      },
      ipAddress: String,
      userAgent: String,
      bookId: String,
    }],
    
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
purchaseSchema.index({ email: 1 })
purchaseSchema.index({ downloadToken: 1 })
purchaseSchema.index({ stripeSessionId: 1 })
purchaseSchema.index({ stripePaymentIntentId: 1 })
purchaseSchema.index({ status: 1, createdAt: -1 })

// Método para verificar si puede descargar
purchaseSchema.methods.canDownload = function(): boolean {
  return this.status === 'completed' && 
         this.downloadCount < 3 && 
         new Date() < this.downloadExpiry
}

// Método para registrar descarga
purchaseSchema.methods.recordDownload = async function(bookId: string, ipAddress: string, userAgent?: string) {
  if (!this.canDownload()) {
    throw new Error('Límite de descargas alcanzado o pedido expirado')
  }
  
  this.downloadCount += 1
  this.downloadHistory.push({
    downloadedAt: new Date(),
    ipAddress,
    userAgent,
    bookId,
  })
  
  return await this.save()
}

const Purchase = models.Purchase || model<IPurchase>('Purchase', purchaseSchema)

export default Purchase
