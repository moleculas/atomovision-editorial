import { protectAdminRoute } from '@/lib/auth/admin'
import Link from 'next/link'
import AdminHeader from './AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // El layout solo se aplicará a páginas que no sean login
  // La página de login tendrá su propio diseño completo
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader />
      
      {/* Contenido principal */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-gray-200">
          <nav className="p-4 space-y-1">
            <Link
              href="/admin"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition duration-200"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/libros"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition duration-200"
            >
              📚 Libros
            </Link>
            <Link
              href="/admin/libros/nuevo"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition duration-200"
            >
              ➕ Nuevo Libro
            </Link>
            <Link
              href="/admin/generos"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition duration-200"
            >
              🏷️ Géneros
            </Link>
            <Link
              href="/admin/ventas"
              className="block px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition duration-200"
            >
              💰 Ventas
            </Link>
          </nav>
        </aside>
        
        {/* Contenido */}
        <main className="flex-1 p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
