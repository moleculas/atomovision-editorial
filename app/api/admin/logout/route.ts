import { NextRequest, NextResponse } from 'next/server'
import { removeAdminCookie } from '@/lib/auth/admin'

export async function POST(request: NextRequest) {
  try {
    await removeAdminCookie()
    
    return NextResponse.json({
      success: true,
      message: 'Logout exitoso'
    })
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { success: false, error: 'Error al cerrar sesión' },
      { status: 500 }
    )
  }
}
