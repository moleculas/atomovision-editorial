import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, createAdminToken } from '@/lib/auth/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body
    
    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Contraseña requerida' },
        { status: 400 }
      )
    }
    
    // Verificar contraseña
    const isValid = verifyAdminPassword(password)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }
    
    // Crear token y establecer cookie
    const token = createAdminToken()
    
    // La función setAdminCookie usa cookies() que no es async en Next.js 13+
    // Necesitamos crear la respuesta y establecer la cookie manualmente
    const response = NextResponse.json({
      success: true,
      message: 'Login exitoso'
    })
    
    response.cookies.set('atomovision-admin', token, {
      httpOnly: true,
      secure: false, // Cambiar a false para desarrollo local
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    })
    
    return response
    
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { success: false, error: 'Error al procesar login' },
      { status: 500 }
    )
  }
}
