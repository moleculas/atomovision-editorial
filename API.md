# API Documentation - Editorial 3D

## Endpoints

### Stripe Integration

#### Create Checkout Session
```
POST /api/stripe/create-checkout-session
```

**Request Body:**
```json
{
  "items": [
    {
      "priceId": "price_xxxxx",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "sessionId": "cs_test_xxxxx"
}
```

#### Webhook Handler
```
POST /api/stripe/webhook
```

Maneja eventos de Stripe. Requiere verificación de firma.

**Eventos soportados:**
- `checkout.session.completed`
- `payment_intent.payment_failed`

## Tipos de datos

### Book
```typescript
interface Book {
  id: string
  slug: string
  title: string
  subtitle?: string
  authors: string[]
  description_md: string
  categories: string[]
  tags: string[]
  coverImage: {
    url: string
    alt: string
    width: number
    height: number
  }
  gallery: Array<{
    url: string
    alt: string
    width: number
    height: number
  }>
  price: number // En centavos
  currency: string
  formats: {
    ebook?: {
      fileUrl: string
      drm?: boolean
      pages: number
    }
    paperback?: {
      isbn: string
      weight: number
      dimensions: {
        width: number
        height: number
        depth: number
      }
    }
    hardcover?: {
      isbn: string
      weight: number
      dimensions: {
        width: number
        height: number
        depth: number
      }
    }
  }
  inventory?: number
  sku: string
  stripeProductId?: string
  stripePriceId?: string
  releaseDate: string
  language: string
  samples?: {
    pdfUrl?: string
    epubUrl?: string
  }
  featured: boolean
  rating?: number
  metaTitle?: string
  metaDescription?: string
  ogImage?: string
}
```

### CartItem
```typescript
interface CartItem {
  bookId: string
  format: 'ebook' | 'paperback' | 'hardcover'
  quantity: number
  price: number
}
```

## Store State

### Cart Store
```typescript
interface CartStore {
  items: CartItem[]
  addItem: (book: Book, format: keyof Book['formats'], quantity?: number) => void
  removeItem: (bookId: string, format: string) => void
  updateQuantity: (bookId: string, format: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}
```

### UI Store
```typescript
interface UIStore {
  viewMode: '3d' | '2d'
  performanceMode: 'high' | 'medium' | 'low'
  language: 'es' | 'en'
  isCartOpen: boolean
  isSearchOpen: boolean
  setViewMode: (mode: ViewMode) => void
  setPerformanceMode: (mode: PerformanceMode) => void
  setLanguage: (lang: Language) => void
  toggleCart: () => void
  toggleSearch: () => void
}
```

### Scene Store
```typescript
interface SceneStore {
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  selectedHotspot: string | null
  setCameraPosition: (position: [number, number, number]) => void
  setCameraTarget: (target: [number, number, number]) => void
  setSelectedHotspot: (id: string | null) => void
}
```

## CMS Integration (Sanity)

### Queries

**Get all books:**
```javascript
*[_type == "book"] | order(releaseDate desc) {
  "id": _id,
  slug,
  title,
  // ... todos los campos
}
```

**Get book by slug:**
```javascript
*[_type == "book" && slug == $slug][0] {
  // ... proyección completa
}
```

**Search books:**
```javascript
*[_type == "book" && (
  title match $query ||
  subtitle match $query ||
  description_md match $query ||
  $query in authors ||
  $query in tags
)] | order(releaseDate desc)
```

## Rendimiento

### GPU Detection
```javascript
import { detectGPU } from '@/lib/performance'

const gpuInfo = await detectGPU()
// Returns: { tier: 1-3, type: string, isMobile: boolean }
```

### Performance Presets
- **High**: Shadows, post-processing, anti-aliasing, high DPR
- **Medium**: Shadows, no post-processing, anti-aliasing, medium DPR
- **Low**: No shadows, no post-processing, no anti-aliasing, low DPR

## SEO

### Metadatos por página
```javascript
import { generateMetadata } from '@/lib/seo'

export const metadata = generateMetadata({
  title: 'Mi página',
  description: 'Descripción',
  image: '/imagen.jpg',
  url: '/mi-pagina'
})
```

### Schema.org
```javascript
import { generateBookSchema } from '@/lib/seo'

const schema = generateBookSchema(book)
// Genera JSON-LD para libros
```

## Seguridad

### Variables de entorno requeridas
- `STRIPE_SECRET_KEY`: Clave secreta de Stripe
- `STRIPE_WEBHOOK_SECRET`: Secret para verificar webhooks
- `CMS_READ_TOKEN`: Token de lectura para Sanity

### Headers de seguridad
Configurados en `next.config.js`:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Datos de prueba
- Usar `mockBooks` de `lib/cms.ts`
- Tarjetas Stripe de prueba documentadas en README
