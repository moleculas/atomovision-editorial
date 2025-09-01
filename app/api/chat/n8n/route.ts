import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Book from '@/lib/mongodb/models/Book'

// Rate limiting: Almacenar en memoria (en producción usar Redis)
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>()

// Limpiar entradas antiguas cada 5 minutos
setInterval(() => {
  const now = Date.now()
  const ONE_HOUR = 60 * 60 * 1000
  
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.firstRequest > ONE_HOUR) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * POST /api/chat/n8n
 * Enviar mensaje al agente N8N del libro
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener IP del cliente
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const rateLimitKey = `chat_${ip}`
    
    // Verificar rate limit
    const now = Date.now()
    const rateLimit = rateLimitMap.get(rateLimitKey)
    
    if (rateLimit) {
      const timePassed = now - rateLimit.firstRequest
      const ONE_MINUTE = 60 * 1000
      
      // Reset cada minuto
      if (timePassed > ONE_MINUTE) {
        rateLimitMap.set(rateLimitKey, { count: 1, firstRequest: now })
      } else {
        // Máximo 5 mensajes por minuto
        if (rateLimit.count >= 5) {
          return NextResponse.json(
            {
              success: false,
              error: 'Demasiados mensajes. Por favor, espera un momento antes de continuar.'
            },
            { status: 429 }
          )
        }
        rateLimit.count++
      }
    } else {
      rateLimitMap.set(rateLimitKey, { count: 1, firstRequest: now })
    }
    
    const body = await request.json()
    const { bookId, message, sessionId } = body

    // Validación básica
    if (!bookId || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'bookId y message son requeridos'
        },
        { status: 400 }
      )
    }
    
    // Validaciones de seguridad del mensaje
    if (typeof message !== 'string' || message.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: 'El mensaje debe ser texto y no exceder 500 caracteres'
        },
        { status: 400 }
      )
    }
    
    // Limpiar mensaje (trim y eliminar espacios múltiples)
    const cleanMessage = message.trim().replace(/\s+/g, ' ')
    
    if (cleanMessage.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'El mensaje es demasiado corto'
        },
        { status: 400 }
      )
    }
    
    // Detectar patrones de spam comunes
    const spamPatterns = [
      /viagra/i,
      /casino/i,
      /\b(buy|cheap|discount|offer|deal)\s+(now|today|online)/i,
      /(http|https|www\.|bit\.ly)/i,  // URLs
      /[\$€£]\d+/,  // Precios
      /(click\s*here|visit\s*now)/i
    ]
    
    for (const pattern of spamPatterns) {
      if (pattern.test(cleanMessage)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Mensaje no permitido'
          },
          { status: 400 }
        )
      }
    }

    // Conectar a MongoDB
    await connectMongoose()

    // Obtener el libro con su configuración N8N
    const book = await Book.findById(bookId).select('title n8nConfig')
    
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: 'Libro no encontrado'
        },
        { status: 404 }
      )
    }

    // Verificar que el libro tenga webhook configurado
    if (!book.n8nConfig?.webhookUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Este libro no tiene chat habilitado'
        },
        { status: 400 }
      )
    }

    // Hacer la petición al webhook N8N
    try {
      const n8nResponse = await fetch(book.n8nConfig.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: cleanMessage,
          bookTitle: book.title,
          agentId: book.n8nConfig.agentId || undefined,
          sessionId: sessionId || undefined,
          timestamp: new Date().toISOString()
        })
      })

      // Verificar si la respuesta es exitosa
      if (!n8nResponse.ok) {
        console.error('Error N8N:', n8nResponse.status, await n8nResponse.text())
        return NextResponse.json(
          {
            success: false,
            error: 'Error al comunicarse con el agente'
          },
          { status: 500 }
        )
      }

      // Obtener la respuesta del agente
      const agentResponse = await n8nResponse.json()

      // N8N devuelve un array con objetos que tienen la propiedad 'output'
      let responseText = 'Lo siento, no pude procesar tu mensaje.'
      
      if (Array.isArray(agentResponse) && agentResponse.length > 0 && agentResponse[0].output) {
        responseText = agentResponse[0].output
      } else if (agentResponse.output) {
        responseText = agentResponse.output
      } else if (agentResponse.response) {
        responseText = agentResponse.response
      } else if (agentResponse.message) {
        responseText = agentResponse.message
      } else if (agentResponse.text) {
        responseText = agentResponse.text
      }

      return NextResponse.json({
        success: true,
        data: {
          response: responseText,
          bookTitle: book.title
        }
      })
      
    } catch (fetchError) {
      console.error('Error al conectar con N8N:', fetchError)
      return NextResponse.json(
        {
          success: false,
          error: 'No se pudo conectar con el servicio de chat'
        },
        { status: 503 }
      )
    }
    
  } catch (error) {
    console.error('Error en chat N8N:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor'
      },
      { status: 500 }
    )
  }
}
