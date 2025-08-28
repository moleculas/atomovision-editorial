import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import HomeSettings from '@/lib/mongodb/models/HomeSettings'

// GET - Obtener configuración de la home
export async function GET(request: NextRequest) {
  try {
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()

    // Buscar la configuración o crear una por defecto
    let settings = await HomeSettings.findOne().populate('featuredBookId')
    
    if (!settings) {
      settings = await HomeSettings.create({})
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error al obtener configuración:', error)
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar configuración
export async function PUT(request: NextRequest) {
  try {
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    
    const body = await request.json()
    
    // Buscar o crear la configuración
    let settings = await HomeSettings.findOne()
    
    if (!settings) {
      settings = new HomeSettings()
    }

    // Actualizar campos
    if (body.featuredBookId !== undefined) {
      settings.featuredBookId = body.featuredBookId
    }
    if (body.headerTitle !== undefined) {
      settings.headerTitle = body.headerTitle
    }
    if (body.headerDescription !== undefined) {
      settings.headerDescription = body.headerDescription
    }
    if (body.chatQuestions !== undefined) {
      settings.chatQuestions = body.chatQuestions
    }

    settings.updatedBy = 'admin'
    await settings.save()

    // Retornar con el libro poblado
    await settings.populate('featuredBookId')

    return NextResponse.json({ 
      message: 'Configuración actualizada correctamente',
      settings 
    })
  } catch (error) {
    console.error('Error al actualizar configuración:', error)
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    )
  }
}
