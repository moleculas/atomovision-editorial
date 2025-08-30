import mongoose, { Schema, model, models } from 'mongoose'

export interface IBook {
  _id?: string
  
  // Registro único AtomoVision
  registroAtomoVision: string
  
  // Identificación básica
  isbn?: string
  title: string
  subtitle?: string
  slug: string
  
  // Género (solo uno)
  genre: string
  
  // Autoría
  authors: Array<{
    name: string
    role: string
    bio?: string
    aiModel?: string
  }>
  
  // Contenido editorial
  synopsis: string
  fullDescription?: string
  excerpt?: string
  pageCount?: number
  language: string
  
  // Archivos y formatos
  formats: {
    epub?: {
      fileUrl: string
      fileSize: number
    }
    pdf?: {
      fileUrl: string
      fileSize: number
    }
    mobi?: {
      fileUrl: string
      fileSize: number
    }
  }
  
  // Imágenes
  cover: {
    original: string
    large?: string
    medium?: string
    small?: string
    thumbnail?: string
  }
  
  // Comercial
  pricing: {
    base: number // En centavos
    currency: string
  }
  
  // Metadatos IA
  aiGeneration?: {
    textModel?: string
    textPrompt?: string
    coverModel?: string
    coverPrompt?: string
    generatedAt?: Date
  }
  
  // Estado y publicación
  status: 'draft' | 'published' | 'archived'
  publishedAt?: Date
  featured: boolean
  
  // Estadísticas
  stats: {
    views: number
    downloads: number
    rating: number
    reviews: number
    totalRatings: number
  }
  
  // Etiquetas
  tags: string[]
  
  // Configuración IA Conversacional
  n8nConfig?: {
    webhookUrl?: string
    agentId?: string
  }
  
  // SEO
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  
  createdAt?: Date
  updatedAt?: Date
}

const bookSchema = new Schema<IBook>(
  {
    // Registro AtomoVision único y obligatorio
    registroAtomoVision: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          // Solo validar que empiece con ATV-
          return v.startsWith('ATV-')
        },
        message: 'El registro AtomoVision debe empezar con ATV-'
      }
    },
    
    isbn: {
      type: String,
      sparse: true, // Permite null pero si existe debe ser único
      validate: {
        validator: function(v: string) {
          if (!v) return true
          // Validar ISBN-13
          return /^978\d{10}$/.test(v.replace(/-/g, ''))
        },
        message: 'ISBN debe ser un ISBN-13 válido'
      }
    },
    
    title: {
      type: String,
      required: true,
      trim: true,
    },
    
    subtitle: {
      type: String,
      trim: true,
    },
    
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    genre: {
      type: String,
      required: true,
      ref: 'Genre',
    },
    
    authors: [{
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        default: 'author',
        enum: ['author', 'translator', 'illustrator', 'editor'],
      },
      bio: String,
      aiModel: String,
    }],
    
    synopsis: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    
    fullDescription: {
      type: String,
      maxlength: 5000,
    },
    
    excerpt: {
      type: String,
      maxlength: 10000,
    },
    
    pageCount: {
      type: Number,
      min: 1,
    },
    
    language: {
      type: String,
      default: 'es',
      enum: ['es', 'en', 'ca', 'eu', 'gl'],
    },
    
    formats: {
      epub: {
        fileUrl: String,
        fileSize: Number,
      },
      pdf: {
        fileUrl: String,
        fileSize: Number,
      },
      mobi: {
        fileUrl: String,
        fileSize: Number,
      },
    },
    
    cover: {
      original: {
        type: String,
        required: true,
      },
      large: String,
      medium: String,
      small: String,
      thumbnail: String,
    },
    
    pricing: {
      base: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: 'EUR',
        enum: ['EUR', 'USD', 'GBP'],
      },
    },
    
    aiGeneration: {
      textModel: String,
      textPrompt: String,
      coverModel: String,
      coverPrompt: String,
      generatedAt: Date,
    },
    
    status: {
      type: String,
      default: 'draft',
      enum: ['draft', 'published', 'archived'],
    },
    
    publishedAt: Date,
    
    featured: {
      type: Boolean,
      default: false,
    },
    
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      downloads: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      reviews: {
        type: Number,
        default: 0,
      },
      totalRatings: {
        type: Number,
        default: 0,
      },
    },
    
    tags: {
      type: [String],
      default: [],
      trim: true,
    },
    
    n8nConfig: {
      webhookUrl: {
        type: String,
        trim: true,
      },
      agentId: {
        type: String,
        trim: true,
      },
    },
    
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
  }
)

// Índices para búsquedas eficientes
// Los campos registroAtomoVision y slug ya tienen unique:true, no necesitan índice adicional
bookSchema.index({ genre: 1 })
bookSchema.index({ status: 1, publishedAt: -1 })
bookSchema.index({ title: 'text', synopsis: 'text' })
bookSchema.index({ 'authors.name': 1 })
bookSchema.index({ featured: 1 })

// Middleware pre-save para actualizar publishedAt
bookSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

// Método para incrementar vistas
bookSchema.methods.incrementViews = async function() {
  this.stats.views += 1
  return await this.save()
}

// Método para incrementar descargas
bookSchema.methods.incrementDownloads = async function() {
  this.stats.downloads += 1
  return await this.save()
}

// Virtual para URL completa del libro
bookSchema.virtual('url').get(function() {
  return `/libro/${this.slug}`
})

// Evitar recompilar el modelo en desarrollo
const Book = models.Book || model<IBook>('Book', bookSchema)

export default Book
