# Sistema de Seguridad - Chat Conversacional AtomoVisión

## Resumen
Este documento detalla las medidas de seguridad implementadas en el sistema de chat conversacional de AtomoVisión para prevenir spam y abuso.

## Medidas Implementadas

### 1. Rate Limiting (Control de Frecuencia)
- **Límite**: 5 mensajes por minuto por IP
- **Duración**: El contador se resetea cada minuto
- **Almacenamiento**: En memoria (Map) - En producción se recomienda Redis
- **Limpieza**: Automática cada 5 minutos para IPs inactivas por más de 1 hora
- **Respuesta**: HTTP 429 cuando se excede el límite

### 2. Validaciones de Entrada

#### Frontend (Fallback2D.tsx)
- **Límite de caracteres**: 500 máximo
- **Prevención**: `maxLength={500}` en el input
- **Validación adicional**: `.slice(0, 500)` en onChange
- **Mensajes vacíos**: Bloqueados (trim validation)

#### Backend (/api/chat/n8n)
- **Longitud máxima**: 500 caracteres
- **Longitud mínima**: 2 caracteres (después de limpiar)
- **Tipo de dato**: Solo strings
- **Limpieza**: 
  - `trim()` para espacios al inicio/final
  - Reemplazo de espacios múltiples por uno solo

### 3. Detección de Spam

#### Patrones bloqueados:
```javascript
const spamPatterns = [
  /viagra/i,
  /casino/i,
  /\b(buy|cheap|discount|offer|deal)\s+(now|today|online)/i,
  /(http|https|www\.|bit\.ly)/i,  // URLs
  /[\$€£]\d+/,  // Precios
  /(click\s*here|visit\s*now)/i
]
```

### 4. Identificación de Cliente
- **IP primaria**: Header `x-forwarded-for`
- **IP secundaria**: Header `x-real-ip`
- **Fallback**: 'unknown' si no se detecta IP

## Mensajes de Error

| Situación | Mensaje | HTTP Status |
|-----------|---------|-------------|
| Rate limit excedido | "Demasiados mensajes. Por favor, espera un momento antes de continuar." | 429 |
| Mensaje muy largo | "El mensaje debe ser texto y no exceder 500 caracteres" | 400 |
| Mensaje muy corto | "El mensaje es demasiado corto" | 400 |
| Patrón de spam | "Mensaje no permitido" | 400 |

## Configuración Ajustable

### Rate Limiting
```javascript
// En /api/chat/n8n/route.ts
const RATE_LIMIT_MAX = 5  // Mensajes por ventana de tiempo
const RATE_LIMIT_WINDOW = 60 * 1000  // 1 minuto en ms
```

### Límites de Longitud
```javascript
// Frontend: /components/ui/Fallback2D.tsx
maxLength={500}

// Backend: /api/chat/n8n/route.ts
const MAX_MESSAGE_LENGTH = 500
const MIN_MESSAGE_LENGTH = 2
```

### Patrones de Spam
Los patrones se pueden modificar en el array `spamPatterns` en `/api/chat/n8n/route.ts`

## Consideraciones para Producción

1. **Rate Limiting con Redis**
   - Reemplazar el Map en memoria por Redis
   - Permitirá rate limiting distribuido entre servidores

2. **Logs de Seguridad**
   - Registrar IPs que alcanzan límites
   - Monitorear patrones de abuso

3. **Captcha**
   - Considerar añadir reCAPTCHA v3 para usuarios sospechosos

4. **Lista Negra de IPs**
   - Implementar sistema de bloqueo permanente para IPs abusivas

5. **Análisis de Contenido Avanzado**
   - Integrar servicios como Perspective API de Google

## Mantenimiento

- Revisar logs semanalmente para identificar nuevos patrones de spam
- Ajustar límites según el uso real
- Actualizar patrones de spam según sea necesario
- Monitorear el rendimiento del rate limiting

## Código de Referencia

### Frontend - Límite de caracteres
```typescript
// /components/ui/Fallback2D.tsx
<input
  type="text"
  value={chatInput}
  onChange={(e) => setChatInput(e.target.value.slice(0, 500))}
  maxLength={500}
  // ...resto de props
/>
```

### Backend - Rate Limiting
```typescript
// /api/chat/n8n/route.ts
if (rateLimit.count >= 5) {
  return NextResponse.json(
    {
      success: false,
      error: 'Demasiados mensajes. Por favor, espera un momento antes de continuar.'
    },
    { status: 429 }
  )
}
```

---

Última actualización: Enero 2025
