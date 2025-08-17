import { connectMongoose } from '../client'
import Genre from '../models/Genre'

// Los 85 géneros literarios de AtomoVision
const GENEROS_DATA = [
  { name: "Ficción especulativa", icon: "🔮", color: "#9333EA" },
  { name: "Ciencia ficción", icon: "🚀", color: "#3B82F6" },
  { name: "Fantasía", icon: "🐉", color: "#8B5CF6" },
  { name: "Ciencia ficción dura", icon: "⚛️", color: "#1E40AF" },
  { name: "Ciencia ficción blanda", icon: "🧠", color: "#7C3AED" },
  { name: "Ciencia ficción social", icon: "👥", color: "#2563EB" },
  { name: "Space opera", icon: "🌌", color: "#4C1D95" },
  { name: "Space opera militar", icon: "⚔️", color: "#1E3A8A" },
  { name: "Ciencia ficción militar", icon: "🎖️", color: "#991B1B" },
  { name: "Ciberpunk", icon: "🤖", color: "#DC2626" },
  { name: "Steampunk", icon: "⚙️", color: "#92400E" },
  { name: "Biopunk", icon: "🧬", color: "#059669" },
  { name: "Dieselpunk", icon: "🛢️", color: "#7C2D12" },
  { name: "Atompunk", icon: "☢️", color: "#A21CAF" },
  { name: "Clockpunk", icon: "🕰️", color: "#B45309" },
  { name: "Postcyberpunk", icon: "📡", color: "#0891B2" },
  { name: "Ucronía", icon: "⏳", color: "#7C3AED" },
  { name: "Ciencia ficción apocalíptica", icon: "☄️", color: "#DC2626" },
  { name: "Ciencia ficción postapocalíptica", icon: "🏚️", color: "#991B1B" },
  { name: "Mundos moribundos", icon: "🌅", color: "#B91C1C" },
  { name: "Distopía", icon: "🏭", color: "#4B5563" },
  { name: "Utopía", icon: "🌈", color: "#10B981" },
  { name: "Utopías ambiguas", icon: "🤔", color: "#6366F1" },
  { name: "Viaje en el tiempo", icon: "⏰", color: "#8B5CF6" },
  { name: "Ciencia ficción de exploración espacial y colonización", icon: "🛸", color: "#0EA5E9" },
  { name: "Primer contacto", icon: "👽", color: "#10B981" },
  { name: "Ciencia ficción antropológica", icon: "🗿", color: "#F59E0B" },
  { name: "Narrativas especulativas", icon: "💭", color: "#A78BFA" },
  { name: "Ciencia ficción humorística", icon: "😄", color: "#FBBF24" },
  { name: "Ciencia ficción filosófica", icon: "🤯", color: "#6366F1" },
  { name: "Slipstream", icon: "🌊", color: "#06B6D4" },
  { name: "Ciencia ficción policíaca", icon: "🔍", color: "#1F2937" },
  { name: "Ciencia ficción bélica", icon: "💥", color: "#EF4444" },
  { name: "Ciencia ficción gótica", icon: "🦇", color: "#581C87" },
  { name: "Space western", icon: "🤠", color: "#D97706" },
  { name: "Fantasía científica", icon: "🔬", color: "#7C3AED" },
  { name: "Climate fiction", icon: "🌡️", color: "#059669" },
  { name: "Solarpunk", icon: "☀️", color: "#84CC16" },
  { name: "Hopepunk", icon: "✊", color: "#F59E0B" },
  { name: "Ciencia ficción especulativa", icon: "🎲", color: "#8B5CF6" },
  { name: "Alta fantasía", icon: "👑", color: "#B91C1C" },
  { name: "Fantasía épica", icon: "⚔️", color: "#7C2D12" },
  { name: "Fantasía heroica", icon: "🛡️", color: "#0369A1" },
  { name: "Espada y brujería", icon: "🗡️", color: "#581C87" },
  { name: "Baja fantasía", icon: "🏰", color: "#6B7280" },
  { name: "Fantasía oscura", icon: "🌑", color: "#111827" },
  { name: "Grimdark", icon: "💀", color: "#000000" },
  { name: "Fantasía urbana", icon: "🏙️", color: "#4B5563" },
  { name: "Realismo mágico", icon: "✨", color: "#EC4899" },
  { name: "Fantasía histórica", icon: "📜", color: "#92400E" },
  { name: "Cuentos de hadas", icon: "🧚", color: "#F472B6" },
  { name: "Fantasía de hadas", icon: "🦋", color: "#C084FC" },
  { name: "Fantasía mitológica", icon: "🏛️", color: "#0891B2" },
  { name: "Fantasía de romance paranormal", icon: "💕", color: "#EC4899" },
  { name: "Fantasía erótica", icon: "🔥", color: "#DC2626" },
  { name: "Fantasía cómica", icon: "😂", color: "#FCD34D" },
  { name: "Fantasía juvenil e infantil", icon: "🧸", color: "#60A5FA" },
  { name: "Noblebright", icon: "🌟", color: "#FDE047" },
  { name: "New Weird", icon: "🌀", color: "#A855F7" },
  { name: "Silkpunk", icon: "🏮", color: "#EF4444" },
  { name: "Fantaterror", icon: "👻", color: "#4C1D95" },
  { name: "Afro-fantasía", icon: "🌍", color: "#D97706" },
  { name: "Afrofantasy", icon: "🌍", color: "#EA580C" },
  { name: "Xianxia", icon: "🏔️", color: "#0EA5E9" },
  { name: "Wuxia", icon: "🥷", color: "#6366F1" },
  { name: "Isekai", icon: "🌸", color: "#F97316" },
  { name: "Fantasía asiática", icon: "🏯", color: "#DC2626" },
  { name: "Fantasía europea no anglosajona", icon: "🏰", color: "#4338CA" },
  { name: "Fantasía celta", icon: "🍀", color: "#059669" },
  { name: "Fantasía latinoamericana", icon: "🌮", color: "#F59E0B" },
  { name: "Fantasía LGBTQ+", icon: "🏳️‍🌈", color: "#E11D48" },
  { name: "Proto-ciencia ficción", icon: "📚", color: "#6B7280" },
  { name: "Proto-fantasía", icon: "📖", color: "#9CA3AF" },
  { name: "Mitología y epopeyas", icon: "⚡", color: "#F59E0B" },
  { name: "Novelas de caballerías", icon: "🏇", color: "#7C2D12" },
  { name: "Novelas góticas", icon: "🕯️", color: "#1F2937" },
  { name: "Romances científicos", icon: "🔭", color: "#4F46E5" },
  { name: "Literatura pulp", icon: "📰", color: "#F97316" },
  { name: "Horror cósmico", icon: "🐙", color: "#312E81" },
  { name: "Afrofuturismo", icon: "🚀", color: "#7C3AED" },
  { name: "Fantastika", icon: "🎭", color: "#BE185D" },
  { name: "K-fantasy", icon: "🌸", color: "#F472B6" },
  { name: "Light novels", icon: "📱", color: "#06B6D4" },
  { name: "Manga", icon: "📚", color: "#EF4444" },
  { name: "Anime", icon: "🎌", color: "#F97316" },
  { name: "Mecha", icon: "🤖", color: "#3B82F6" }
]

/**
 * Función para crear un slug a partir del nombre
 */
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Script para poblar la base de datos con los géneros
 */
export async function seedGenres() {
  try {
    console.log('🌱 Iniciando seed de géneros...')
    
    // Conectar a MongoDB
    await connectMongoose()
    console.log('✅ Conectado a MongoDB')
    
    // Limpiar géneros existentes (opcional - comentar en producción)
    await Genre.deleteMany({})
    console.log('🗑️ Géneros anteriores eliminados')
    
    // Preparar datos de géneros
    const genresData = GENEROS_DATA.map((genre, index) => ({
      code: createSlug(genre.name),
      name: genre.name,
      description: `Género literario: ${genre.name}`,
      color: genre.color,
      icon: genre.icon,
      order: index + 1,
      bookCount: 0,
      featured: index < 10, // Los primeros 10 son destacados
      metadata: {
        keywords: [
          genre.name.toLowerCase(),
          'literatura',
          'ficción',
          'fantasía',
          'ciencia ficción'
        ].filter(k => k.includes(genre.name.toLowerCase().split(' ')[0])),
        relatedGenres: []
      }
    }))
    
    // Insertar géneros
    const result = await Genre.insertMany(genresData)
    console.log(`✅ ${result.length} géneros insertados correctamente`)
    
    // Establecer algunas relaciones básicas
    const sciFi = await Genre.findOne({ code: 'ciencia-ficcion' })
    const fantasy = await Genre.findOne({ code: 'fantasia' })
    
    if (sciFi) {
      // Actualizar subgéneros de ciencia ficción
      await Genre.updateMany(
        { 
          name: { 
            $regex: /^Ciencia ficción/i 
          },
          _id: { $ne: sciFi._id }
        },
        { 
          $set: { parentGenre: sciFi.code }
        }
      )
    }
    
    if (fantasy) {
      // Actualizar subgéneros de fantasía
      await Genre.updateMany(
        { 
          name: { 
            $regex: /^Fantasía/i 
          },
          _id: { $ne: fantasy._id }
        },
        { 
          $set: { parentGenre: fantasy.code }
        }
      )
    }
    
    console.log('✅ Relaciones de géneros establecidas')
    console.log('🎉 Seed completado exitosamente')
    
    return true
  } catch (error) {
    console.error('❌ Error durante el seed:', error)
    throw error
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  seedGenres()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
