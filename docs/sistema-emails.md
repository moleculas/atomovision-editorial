# Sistema de Emails - AtomoVisión

## 📧 Descripción General

Este documento describe el sistema de envío de emails implementado en AtomoVisión, que utiliza **Resend** como servicio de envío y **React Email** para templates profesionales.

## 🚀 Tecnologías Utilizadas

- **Resend**: Servicio de envío de emails transaccionales
- **React Email**: Framework para crear templates de email con React
- **@react-email/components**: Componentes pre-construidos para emails
- **@react-email/render**: Renderizador de componentes a HTML

## 📁 Estructura del Sistema

```
/lib/email/
├── client.ts          # Cliente Resend configurado
├── send.ts           # Funciones de envío y lógica principal
└── templates/        # Templates de email
    └── contact.tsx   # Template para formulario de contacto
```

## 🔧 Configuración

### Variables de Entorno (.env.local)

```env
# API Key de Resend (obtener de https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Email desde el cual se envían los correos
EMAIL_FROM=AtomoVisión <onboarding@resend.dev>

# Email donde llegan los mensajes de contacto
CONTACT_EMAIL=info@atomovision.es
```

### Configuración para Producción

1. **Verificar dominio propio**:
   - Ir a Resend Dashboard → Domains
   - Añadir tu dominio
   - Configurar registros DNS (SPF, DKIM)
   - Actualizar `EMAIL_FROM` con tu dominio verificado

## 📝 Crear Nuevos Templates

### 1. Crear el archivo del template

Crear un nuevo archivo en `/lib/email/templates/[nombre].tsx`:

```tsx
import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components'

interface PurchaseEmailProps {
  customerName: string
  orderNumber: string
  bookTitle: string
  downloadUrl: string
}

export default function PurchaseEmail({
  customerName,
  orderNumber,
  bookTitle,
  downloadUrl,
}: PurchaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu compra en AtomoVisión - Orden #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Gracias por tu compra!</Heading>
          
          <Text style={text}>Hola {customerName},</Text>
          
          <Text style={text}>
            Tu compra de "{bookTitle}" se ha completado exitosamente.
          </Text>
          
          <Section style={buttonContainer}>
            <Button href={downloadUrl} style={button}>
              Descargar libro
            </Button>
          </Section>
          
          <Text style={footer}>
            Número de orden: {orderNumber}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '32px',
}
```

### 2. Importar el template en send.ts

```typescript
import PurchaseEmail from './templates/purchase'
```

### 3. Añadir el caso en la función sendEmail

```typescript
case 'purchase':
  try {
    const rendered = render(PurchaseEmail(data))
    
    if (rendered instanceof Promise) {
      const result = await rendered
      html = typeof result === 'string' ? result : result.html
    } else {
      html = typeof rendered === 'string' ? rendered : rendered.html
    }
  } catch (error) {
    // HTML de fallback
    html = `<h2>Gracias por tu compra</h2>...`
  }
  break
```

### 4. Crear función helper específica (opcional)

```typescript
export async function sendPurchaseEmail(data: {
  customerName: string
  customerEmail: string
  orderNumber: string
  bookTitle: string
  downloadUrl: string
}) {
  return sendEmail({
    to: data.customerEmail,
    subject: `Tu compra en AtomoVisión - ${data.bookTitle}`,
    template: 'purchase',
    data,
  })
}
```

## 🎨 Componentes Disponibles en React Email

- **Container**: Contenedor principal con ancho máximo
- **Section**: Secciones de contenido
- **Heading**: Títulos (h1, h2, etc.)
- **Text**: Párrafos de texto
- **Button**: Botones con estilos
- **Link**: Enlaces
- **Img**: Imágenes responsivas
- **Hr**: Líneas divisorias
- **Row/Column**: Layout en columnas
- **Preview**: Texto de vista previa del email

## 💡 Mejores Prácticas

1. **Siempre incluir fallback HTML**: En caso de error con React Email
2. **Usar estilos inline**: Los emails requieren CSS inline
3. **Probar en múltiples clientes**: Gmail, Outlook, Apple Mail
4. **Mantener el diseño simple**: Evitar layouts complejos
5. **Imágenes con URLs absolutas**: No rutas relativas
6. **Texto alternativo**: Para accesibilidad

## 🧪 Testing

### Desarrollo Local

1. Usar el dominio gratuito de Resend: `onboarding@resend.dev`
2. Los emails funcionan en localhost
3. Revisar carpeta de spam inicialmente

### Herramientas Útiles

- **React Email Preview**: `npx email dev` para preview local
- **Resend Dashboard**: Ver emails enviados y estado
- **Litmus/Email on Acid**: Testing en múltiples clientes

## 📊 Tipos de Templates Sugeridos

1. **contact**: Formulario de contacto ✅ (Implementado)
2. **purchase**: Confirmación de compra
3. **download**: Enlaces de descarga
4. **welcome**: Bienvenida a nuevos usuarios
5. **newsletter**: Boletín informativo
6. **password-reset**: Recuperación de contraseña
7. **order-status**: Estado del pedido

## 🚨 Manejo de Errores

El sistema tiene dos niveles de fallback:

1. **React Email falla**: Usa HTML simple
2. **Envío falla**: Retorna error al cliente

```typescript
if (!result.success) {
  // Manejar error en el frontend
  console.error('Error al enviar email:', result.error)
}
```

## 🔒 Seguridad

1. **Rate Limiting**: Implementado en `/api/contact`
2. **Validación**: Todos los campos se validan
3. **Honeypot**: Campo invisible para detectar bots
4. **Sanitización**: Los datos se limpian antes de enviar

## 📈 Límites y Costos

### Plan Gratuito de Resend
- 100 emails/mes
- 1 dominio verificado
- Acceso a API completa

### Planes de Pago
- Pro: 5,000 emails/mes ($20)
- Más planes disponibles en resend.com/pricing

## 🛠️ Troubleshooting

### Email no llega
1. Verificar API key correcta
2. Revisar carpeta spam
3. Verificar logs en Resend Dashboard
4. Comprobar variables de entorno

### Error de renderizado
1. Verificar sintaxis del template
2. Comprobar importaciones
3. Revisar que el HTML fallback funcione

### Emails van a spam
1. Verificar dominio propio
2. Configurar SPF/DKIM
3. Evitar palabras spam en asunto
4. Mantener buen ratio texto/imágenes
