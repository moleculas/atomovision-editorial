import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email/send'

// Rate limiting simple (en producción usar algo más robusto)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = requestCounts.get(ip)
  
  if (!limit || now > limit.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000 // 1 hora
    })
    return true
  }
  
  if (limit.count >= 5) { // Máximo 5 emails por hora
    return false
  }
  
  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Verificar rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Por favor, intenta más tarde.' },
        { status: 429 }
      )
    }
    
    const body = await request.json()
    const { name, email, subject, message, honeypot } = body
    
    // Verificar honeypot (campo invisible para bots)
    if (honeypot) {
      return NextResponse.json(
        { success: true }, // Fingir éxito para no alertar al bot
        { status: 200 }
      )
    }
    
    // Validación básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }
    
    // Limitar longitud de campos
    if (name.length > 100 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Los campos exceden la longitud máxima permitida' },
        { status: 400 }
      )
    }
    
    // Enviar email
    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    })
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Error al enviar el mensaje. Por favor, intenta más tarde.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tu mensaje ha sido enviado al Bibliotecario. Te responderá en breve.'
    })
    
  } catch (error) {
    console.error('Error en API de contacto:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
