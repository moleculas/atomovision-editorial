# AtomoVisión - Editorial de libros de fantasía y ciencia ficción generados por IA

Una plataforma editorial innovadora especializada en libros de fantasía y ciencia ficción creados con inteligencia artificial, construida con Next.js, MongoDB y Stripe.

## 🚀 Características principales

- **Libros generados por IA**: Catálogo único de obras creadas con tecnología de vanguardia
- **Interfaz moderna**: Experiencia de usuario elegante y minimalista
- **Rendimiento adaptativo**: Ajuste automático de calidad según las capacidades del dispositivo
- **Catálogo completo**: Filtros, búsqueda y ordenamiento de libros
- **Carrito de compra**: Gestión de pedidos con persistencia local
- **Pagos seguros**: Integración completa con Stripe Checkout
- **Responsive**: Optimizado para desktop y móvil
- **Accesible**: Cumple con estándares WAI-ARIA
- **SEO optimizado**: Metadatos estructurados y schema.org

## 📋 Requisitos previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Stripe (para pagos)
- Cuenta de Sanity (opcional, para CMS)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone [url-del-repo]
cd editorial-3d
```

2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de variables de entorno:
```bash
cp .env.example .env.local
```

4. Configura las variables de entorno en `.env.local`:
```env
# URL del sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret

# Sanity CMS (opcional)
CMS_PROJECT_ID=tu_proyecto_id
CMS_DATASET=production
CMS_READ_TOKEN=tu_token_lectura
```

5. Ejecuta el seed inicial (crea productos demo):
```bash
npm run seed
```

6. Inicia el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del proyecto

```
editorial-3d/
├── app/                    # App Router de Next.js
│   ├── (site)/            # Rutas del sitio principal
│   │   ├── page.tsx       # Página principal (lobby 3D)
│   │   ├── catalog/       # Catálogo de libros
│   │   ├── book/[slug]/   # Detalle de libro
│   │   ├── cart/          # Carrito de compra
│   │   └── success/       # Página de éxito
│   └── api/               # API Routes
│       └── stripe/        # Endpoints de Stripe
├── components/
│   ├── 3d/                # Componentes Three.js/R3F
│   │   ├── Scene.tsx      # Escena principal
│   │   ├── Lobby.tsx      # Lobby editorial
│   │   ├── Shelf.tsx      # Estantería 3D
│   │   └── BookMesh.tsx   # Modelo 3D de libro
│   └── ui/                # Componentes UI 2D
├── lib/                   # Utilidades y configuración
│   ├── store.ts          # Estado global (Zustand)
│   ├── cms.ts            # Cliente CMS
│   ├── stripe.ts         # Utilidades Stripe
│   └── performance.ts    # Detección GPU
├── public/
│   ├── models/           # Modelos GLB/GLTF
│   └── textures/         # Texturas optimizadas
└── types/                # Tipos TypeScript
```

## 🎮 Modos de navegación

### Modo 3D
- **Rotación**: Click y arrastra
- **Zoom**: Scroll del ratón
- **Hotspots**: Click en los puntos interactivos
- **Libros**: Click para ver detalles

### Modo 2D (Fallback)
- Interfaz tradicional de e-commerce
- Mantiene toda la funcionalidad
- Se activa automáticamente si WebGL no está disponible

## 🎨 Personalización

### Añadir nuevos libros

1. **Con CMS (Sanity)**:
   - Accede a tu panel de Sanity
   - Crea un nuevo documento tipo "Book"
   - Completa todos los campos requeridos

2. **Sin CMS (datos mock)**:
   - Edita `lib/cms.ts`
   - Añade nuevos libros al array `mockBooks`

### Modelos 3D personalizados

1. Exporta tus modelos en formato GLB/GLTF
2. Optimiza con Draco o Meshopt:
   ```bash
   npx gltf-pipeline -i modelo.gltf -o modelo-optimizado.glb -d
   ```
3. Coloca en `public/models/`
4. Importa en tus componentes 3D

### Texturas

1. Convierte a formato KTX2 para mejor rendimiento:
   ```bash
   npx ktx2-encoder -i textura.png -o textura.ktx2
   ```
2. Coloca en `public/textures/`

## 💳 Configuración de Stripe

### Desarrollo local

1. Instala Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   scoop install stripe
   ```

2. Autentica:
   ```bash
   stripe login
   ```

3. Escucha webhooks localmente:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copia el webhook secret que te proporciona y actualiza `.env.local`

### Producción

1. En el dashboard de Stripe, ve a Webhooks
2. Añade endpoint: `https://tu-dominio.com/api/stripe/webhook`
3. Selecciona eventos: `checkout.session.completed`
4. Copia el signing secret

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Tests con cobertura
npm run test:coverage
```

### Tarjetas de prueba Stripe
- Éxito: `4242 4242 4242 4242`
- Fallo: `4000 0000 0000 0002`
- Requiere autenticación: `4000 0025 0000 3155`

## 🚀 Despliegue

### Vercel (recomendado)

1. Instala Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Despliega:
   ```bash
   vercel
   ```

3. Configura las variables de entorno en el panel de Vercel

### Otras plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📊 Rendimiento

### Optimizaciones implementadas

- **Lazy loading**: Componentes 3D se cargan bajo demanda
- **Compresión de assets**: Modelos y texturas optimizados
- **Detección GPU**: Ajuste automático de calidad
- **Code splitting**: División automática del código
- **Image optimization**: Next.js Image para imágenes 2D

### Métricas objetivo

- Lighthouse Performance: >90 (modo 2D), >80 (modo 3D)
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <500KB inicial

## 🔧 Solución de problemas

### El modo 3D no carga
1. Verifica soporte WebGL: `chrome://gpu`
2. Actualiza drivers de GPU
3. Prueba en modo incógnito
4. Fuerza modo 2D: añade `?mode=2d` a la URL

### Error de Stripe
1. Verifica las claves en `.env.local`
2. Asegúrate de que el webhook esté escuchando
3. Revisa los logs: `stripe logs tail`

### Problemas de rendimiento
1. Reduce la calidad en configuración
2. Desactiva efectos post-procesamiento
3. Limita el número de libros mostrados

## 📚 Documentación adicional

- [Next.js](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Stripe](https://stripe.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Sanity](https://www.sanity.io/docs)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/nueva-caracteristica`
3. Commit: `git commit -m 'Añade nueva característica'`
4. Push: `git push origin feature/nueva-caracteristica`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- Desarrollo 3D: [Tu nombre]
- UI/UX: [Tu nombre]
- Backend: [Tu nombre]

## 📞 Soporte

- Email: soporte@atomovision.com
- Issues: [GitHub Issues](https://github.com/tu-usuario/editorial-3d/issues)
- Discord: [Únete a nuestro servidor](https://discord.gg/tu-servidor)
