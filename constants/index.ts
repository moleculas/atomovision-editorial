// Configuración general de la aplicación
export const APP_CONFIG = {
  name: 'AtomoVisión',
  description: 'Editorial de libros de fantasía y ciencia ficción generados por IA',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
}

// Configuración del repositorio externo de imágenes
export const ARCHILLECT_CONFIG = {
  // URL base del repositorio
  BASE_URL: 'https://anomaliagravitatoria.net/repositorio/assets/images/archillect/',
  // URL del proxy PHP (si decides usarlo)
  PHP_PROXY_URL: process.env.NEXT_PUBLIC_ARCHILLECT_PROXY_URL || 'https://anomaliagravitatoria.net/cors-archillect.php?file=',
  
  // Número total de archivos disponibles
  TOTAL_FILES: 36000,
  
  // Patrón de nombres de archivo (ajustar según el patrón real)
  FILE_PATTERN: {
    prefix: '', // Si los archivos tienen un prefijo común
    digits: 6,  // Número de dígitos en el ID (ej: 000001.jpg)
    extensions: ['.jpg', '.mp4'] // Extensiones disponibles
  },
  
  // Tiempo entre cambios de imagen (ms)
  CHANGE_INTERVAL: 10000, // Aumentado a 10 segundos para dar tiempo a los videos
  
  // Número de intentos si falla la carga
  MAX_RETRIES: 3,
}

// Configuración de la escena 3D
export const SCENE_CONFIG = {
  // Tiempo entre cambios de imagen en la esfera (en milisegundos)
  IMAGE_CHANGE_INTERVAL: 5000,
  
  // Velocidades de rotación
  SPHERE_ROTATION_SPEED: 0.1,
  BOOK_ROTATION_SPEED: 0.5,
  RING_ROTATION_SPEED: 0.2,
  PARTICLES_ROTATION_SPEED: 0.02,
  
  // Configuración de partículas
  PARTICLE_COUNT: 1000,
  
  // Tamaños
  SPHERE_RADIUS: 3,
  SPHERE_SEGMENTS: 32,
  SPHERE_GEOMETRY: [3, 64, 64] as [number, number, number],
  
  // Colores de los libros
  BOOK_COLORS: {
    green: '#00ff00',
    red: '#ff0000',
    blue: '#0000ff',
    yellow: '#ffff00',
    magenta: '#ff00ff',
    cyan: '#00ffff',
  },
  
  // Configuración de cámara
  CAMERA: {
    position: [0, 4, 15],  // Acercamos la cámara para que el átomo se vea más grande
    fov: 60,
    minDistance: 5,
    maxDistance: 30,
  }
}

// Rutas de archivos multimedia
export const MEDIA_CONFIG = {
  // Ruta donde se almacenan las imágenes y videos locales
  MEDIA_PATH: '/media/',
  
  // Extensiones permitidas
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.mp4', '.webm', '.gif'],
  
  // Tiempo de caché en segundos
  CACHE_TIME: 3600,
}

// Configuración de la tienda
export const STORE_CONFIG = {
  // Moneda
  CURRENCY: 'EUR',
  CURRENCY_SYMBOL: '€',
  
  // IVA
  TAX_RATE: 0.21,
  
  // Formatos de libro disponibles
  BOOK_FORMATS: {
    EBOOK: 'ebook',
    PAPERBACK: 'paperback',
    HARDCOVER: 'hardcover',
  }
}

// Mensajes y textos de la aplicación
export const UI_TEXTS = {
  WELCOME_TITLE: 'Bienvenido a AtomoVisión',
  WELCOME_SUBTITLE: 'Explora nuestra colección en un espacio inmersivo',
  
  BUTTONS: {
    EXPLORE_CATALOG: 'Explorar Catálogo',
    VIEW_NEWS: 'Ver Novedades',
    CHANGE_TO_2D: 'Cambiar a modo 2D',
    CHANGE_TO_3D: 'Cambiar a modo 3D',
    ADD_TO_CART: 'Añadir al carrito',
    BUY_NOW: 'Comprar ahora',
  },
  
  NAVIGATION: {
    CATALOG: 'Catálogo',
    COLLECTIONS: 'Colecciones',
    ABOUT_US: 'Nosotros',
    CART: 'Carrito',
  }
}

// Configuración de rendimiento
export const PERFORMANCE_CONFIG = {
  // Modos de rendimiento
  MODES: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
  },
  
  // Configuración por modo
  SETTINGS: {
    low: {
      shadows: false,
      antialias: false,
      dpr: [1, 1],
      particleCount: 500,
    },
    medium: {
      shadows: true,
      antialias: true,
      dpr: [1, 1.5],
      particleCount: 1000,
    },
    high: {
      shadows: true,
      antialias: true,
      dpr: [1, 2],
      particleCount: 2000,
    }
  }
}
