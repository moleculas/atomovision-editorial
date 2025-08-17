import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminToken } from '@/lib/auth/admin'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Solo aplicar a rutas admin
  if (pathname.startsWith('/admin')) {
    // Verificar cookie de admin
    const adminCookie = request.cookies.get('atomovision-admin')
    
    if (!adminCookie || !adminCookie.value) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}
