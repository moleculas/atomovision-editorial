import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import Purchase from '@/lib/mongodb/models/Purchase'
import { ensureModelsAreRegistered } from '@/lib/mongodb/ensure-models'

export async function GET(request: NextRequest) {
  try {
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    ensureModelsAreRegistered() // Asegurar que todos los modelos estén registrados
    
    // Obtener todas las compras completadas
    let completedPurchases = []
    try {
      completedPurchases = await Purchase
        .find({ status: 'completed' })
        .populate('items.book')
        .lean()
    } catch (populateError) {
      console.error('Error en populate, obteniendo sin populate:', populateError)
      // Si falla el populate, obtener sin él
      completedPurchases = await Purchase
        .find({ status: 'completed' })
        .lean()
    }
    
    // Calcular estadísticas
    let totalRevenue = 0
    let totalBooks = 0
    const bookSales: { [key: string]: { title: string, sales: number } } = {}
    const uniqueCustomers = new Set<string>()
    
    completedPurchases.forEach(purchase => {
      totalRevenue += purchase.totalAmount || 0
      uniqueCustomers.add(purchase.email)
      
      if (purchase.items && Array.isArray(purchase.items)) {
        purchase.items.forEach(item => {
          totalBooks += item.quantity || 0
          // Solo procesar si el libro existe
          if (item.book && item.book._id && item.book.title) {
            const bookId = item.book._id.toString()
            if (!bookSales[bookId]) {
              bookSales[bookId] = {
                title: item.book.title,
                sales: 0
              }
            }
            bookSales[bookId].sales += item.quantity || 0
          }
        })
      }
    })
    
    // Encontrar el libro más vendido
    let bestSeller = null
    let maxSales = 0
    Object.values(bookSales).forEach(book => {
      if (book.sales > maxSales) {
        maxSales = book.sales
        bestSeller = book
      }
    })
    
    // Ventas de los últimos 30 días
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentSales = completedPurchases.filter(p => 
      new Date(p.createdAt!) > thirtyDaysAgo
    ).length
    
    return NextResponse.json({
      success: true,
      data: {
        totalSales: completedPurchases.length,
        totalRevenue,
        totalBooks,
        totalCustomers: uniqueCustomers.size,
        bestSeller,
        recentSales
      }
    })
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener las estadísticas'
      },
      { status: 500 }
    )
  }
}
