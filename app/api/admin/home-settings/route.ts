import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import HomeSettings from '@/lib/mongodb/models/HomeSettings'
import mongoose from 'mongoose'

// GET - Obtener configuración de la home
export async function GET(_request: NextRequest) {
  try {
    console.log('[HOME-SETTINGS GET] Iniciando obtención de configuración')
    
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    console.log('[HOME-SETTINGS GET] MongoDB conectado')

    // Buscar la configuración o crear una por defecto
    let settings = await HomeSettings.findOne().populate('featuredBookId')
    console.log('[HOME-SETTINGS GET] Settings encontrados:', settings ? 'Sí' : 'No')
    
    if (!settings) {
      console.log('[HOME-SETTINGS GET] Creando settings por defecto')
      settings = await HomeSettings.create({})
    }

    console.log('[HOME-SETTINGS GET] Enviando respuesta')
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('[HOME-SETTINGS GET] Error completo:', error)
    console.error('[HOME-SETTINGS GET] Stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { 
        error: 'Error al obtener configuración',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// PUT - Actualizar configuración
export async function PUT(request: NextRequest) {
  try {
    console.log('[HOME-SETTINGS PUT] Iniciando actualización')
    
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    console.log('[HOME-SETTINGS PUT] MongoDB conectado')
    
    const body = await request.json()
    console.log('[HOME-SETTINGS PUT] Body recibido:', JSON.stringify(body))
    
    // Validar featuredBookId si existe
    if (body.featuredBookId && body.featuredBookId !== '') {
      console.log('[HOME-SETTINGS PUT] Validando featuredBookId:', body.featuredBookId)
      // Verificar que es un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(body.featuredBookId)) {
        console.error('[HOME-SETTINGS PUT] featuredBookId inválido:', body.featuredBookId)
        return NextResponse.json(
          { error: 'featuredBookId inválido' },
          { status: 400 }
        )
      }
    }
    
    // Buscar o crear la configuración
    let settings = await HomeSettings.findOne()
    console.log('[HOME-SETTINGS PUT] Settings existentes:', settings ? 'Encontrados' : 'No encontrados')
    
    if (!settings) {
      settings = new HomeSettings()
      console.log('[HOME-SETTINGS PUT] Creando nueva configuración')
    }

    // Actualizar campos
    if (body.featuredBookId !== undefined) {
      settings.featuredBookId = body.featuredBookId === '' ? null : body.featuredBookId
      console.log('[HOME-SETTINGS PUT] featuredBookId actualizado a:', settings.featuredBookId)
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
    
    console.log('[HOME-SETTINGS PUT] Guardando settings...')
    await settings.save()
    console.log('[HOME-SETTINGS PUT] Settings guardados exitosamente')

    // Retornar con el libro poblado
    await settings.populate('featuredBookId')
    console.log('[HOME-SETTINGS PUT] Settings populated')

    return NextResponse.json({ 
      message: 'Configuración actualizada correctamente',
      settings 
    })
  } catch (error) {
    console.error('[HOME-SETTINGS PUT] Error completo:', error)
    console.error('[HOME-SETTINGS PUT] Stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.json(
      { 
        error: 'Error al actualizar configuración',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
