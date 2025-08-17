import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'atomovision-secret-key-2025'
const COOKIE_NAME = 'atomovision-admin'

export interface AdminPayload {
  isAdmin: boolean
  loginTime: number
}

/**
 * Crear token JWT para admin
 */
export function createAdminToken(): string {
  const payload: AdminPayload = {
    isAdmin: true,
    loginTime: Date.now()
  }
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h' // Token válido por 24 horas
  })
}

/**
 * Verificar token JWT
 */
export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload
  } catch {
    return null
  }
}

/**
 * Establecer cookie de admin
 */
export async function setAdminCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 horas
    path: '/'
  })
}

/**
 * Obtener cookie de admin
 */
export async function getAdminCookie(): Promise<string | undefined> {
  return cookies().get(COOKIE_NAME)?.value
}

/**
 * Eliminar cookie de admin
 */
export async function removeAdminCookie() {
  cookies().delete(COOKIE_NAME)
}

/**
 * Verificar si el usuario es admin
 */
export async function isAdmin(): Promise<boolean> {
  const token = await getAdminCookie()
  if (!token) return false
  
  const payload = verifyAdminToken(token)
  return payload?.isAdmin === true
}

/**
 * Proteger ruta de admin
 */
export async function protectAdminRoute() {
  const adminAuth = await isAdmin()
  if (!adminAuth) {
    redirect('/admin/login')
  }
}

/**
 * Verificar contraseña de admin
 */
export function verifyAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminPassword) {
    console.error('⚠️ ADMIN_PASSWORD no está definida en .env.local')
    return false
  }
  
  return password === adminPassword
}
