import mongoose, { Schema, models, model } from 'mongoose'

export interface IHomeSettings {
  _id?: string
  featuredBookId?: mongoose.Types.ObjectId
  headerTitle: string
  headerDescription: string
  chatQuestions: {
    question1: string
    question2: string
    question3: string
    question4: string
  }
  updatedAt?: Date
  updatedBy?: string
}

const HomeSettingsSchema = new Schema<IHomeSettings>({
  featuredBookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: false
  },
  headerTitle: {
    type: String,
    default: 'AtomoVisión'
  },
  headerDescription: {
    type: String,
    default: 'AtomoVisión es una editorial digital que utiliza inteligencia artificial para crear libros únicos de ciencia ficción y fantasía. Cada obra es una experiencia literaria original que explora nuevos mundos e historias.'
  },
  chatQuestions: {
    question1: {
      type: String,
      default: '¿Cómo es el mundo donde vives?'
    },
    question2: {
      type: String,
      default: '¿Cuál es tu mayor miedo?'
    },
    question3: {
      type: String,
      default: 'Cuéntame sobre los otros personajes'
    },
    question4: {
      type: String,
      default: '¿Qué secretos guardas?'
    }
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
})

// No necesitamos índice en _id, MongoDB lo crea automáticamente

const HomeSettings = models.HomeSettings || model<IHomeSettings>('HomeSettings', HomeSettingsSchema)

export default HomeSettings
