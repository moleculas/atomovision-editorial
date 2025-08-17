// Constantes administrativas para AtomoVisión

// Modelos de IA para generación de texto
export const AI_TEXT_MODELS = [
  'OpenAI',
  'Claude',
  'Gemini',
  'DeepSeek',
  'Qwen',
  'Mistral',
  'LLaMA',
  'Grok'
] as const

// Modelos de IA para generación de imágenes
export const AI_IMAGE_MODELS = [
  'DALL-E',
  'Midjourney'
] as const

// Tipos TypeScript derivados de las constantes
export type AITextModel = typeof AI_TEXT_MODELS[number]
export type AIImageModel = typeof AI_IMAGE_MODELS[number]

// Estados de publicación
export const PUBLICATION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
} as const

// Idiomas disponibles
export const LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'Inglés' },
  { code: 'ca', name: 'Catalán' },
  { code: 'eu', name: 'Euskera' },
  { code: 'gl', name: 'Gallego' }
] as const

// Monedas
export const CURRENCIES = {
  EUR: 'EUR',
  USD: 'USD'
} as const

// Roles de autor
export const AUTHOR_ROLES = {
  AUTHOR: 'author',
  CO_AUTHOR: 'co-author',
  EDITOR: 'editor',
  TRANSLATOR: 'translator'
} as const
