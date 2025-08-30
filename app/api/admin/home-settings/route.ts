import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import HomeSettings from '@/lib/mongodb/models/HomeSettings'
import Book from '@/lib/mongodb/models/Book' // Importante: registrar el modelo Book
import mongoose from 'mongoose'
import { ensureModelsAreRegistered } from '@/lib/mongodb/models'

// GET - Obtener configuración de la home
export async function GET(_request: NextRequest) {
  try {
    console.log('[HOME-SETTINGS GET] Iniciando obtención de configuración')
    
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    console.log('[HOME-SETTINGS GET] MongoDB conectado')
    
    // Asegurar que todos los modelos estén registrados
    ensureModelsAreRegistered()

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
    console.log('[HOME-SETTINGS PUT] URL:', request.url)
    console.log('[HOME-SETTINGS PUT] Method:', request.method)
    console.log('[HOME-SETTINGS PUT] Headers:', Object.fromEntries(request.headers.entries()))
    console.log('[HOME-SETTINGS PUT] Cookies:', request.cookies.getAll())
    console.log('[HOME-SETTINGS PUT] Environment:', process.env.NODE_ENV)
    console.log('[HOME-SETTINGS PUT] MongoDB URI exists:', !!process.env.MONGODB_URI)
    
    // TODO: Verificar autenticación de admin
    
    console.log('[HOME-SETTINGS PUT] Estado conexión ANTES de conectar:', mongoose.connection.readyState)
    console.log('[HOME-SETTINGS PUT] Estados: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting')
    
    try {
      await connectMongoose()
      console.log('[HOME-SETTINGS PUT] MongoDB conectado exitosamente')
    } catch (connError) {
      console.error('[HOME-SETTINGS PUT] Error al conectar MongoDB:', connError)
      throw connError
    }
    
    console.log('[HOME-SETTINGS PUT] Estado conexión DESPUÉS de conectar:', mongoose.connection.readyState)
    console.log('[HOME-SETTINGS PUT] Base de datos:', mongoose.connection.db?.databaseName)
    
    // Asegurar que todos los modelos estén registrados
    ensureModelsAreRegistered()
    console.log('[HOME-SETTINGS PUT] Modelos registrados:', Object.keys(mongoose.models))
    
    const body = await request.json()
    console.log('[HOME-SETTINGS PUT] Body recibido:', JSON.stringify(body, null, 2))
    console.log('[HOME-SETTINGS PUT] Body keys:', Object.keys(body))
    
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
    let settings
    try {
      console.log('[HOME-SETTINGS PUT] Buscando HomeSettings...')
      settings = await HomeSettings.findOne()
      console.log('[HOME-SETTINGS PUT] Búsqueda completada')
    } catch (findError) {
      console.error('[HOME-SETTINGS PUT] Error al buscar settings:', findError)
      console.error('[HOME-SETTINGS PUT] Tipo de error:', findError instanceof Error ? findError.constructor.name : 'Unknown')
      throw findError
    }
    
    console.log('[HOME-SETTINGS PUT] Settings existentes:', settings ? 'Encontrados' : 'No encontrados')
    console.log('[HOME-SETTINGS PUT] Settings ID:', settings?._id)
    console.log('[HOME-SETTINGS PUT] Settings actual:', settings ? JSON.stringify(settings.toObject(), null, 2) : 'null')
    
    if (!settings) {
      settings = new HomeSettings()
      console.log('[HOME-SETTINGS PUT] Creando nueva configuración')
    }

    // Actualizar campos
    const oldValues = {
      featuredBookId: settings.featuredBookId,
      headerTitle: settings.headerTitle,
      headerDescription: settings.headerDescription,
      chatQuestions: settings.chatQuestions
    }
    console.log('[HOME-SETTINGS PUT] Valores anteriores:', JSON.stringify(oldValues, null, 2))
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
    
    const newValues = {
      featuredBookId: settings.featuredBookId,
      headerTitle: settings.headerTitle,
      headerDescription: settings.headerDescription,
      chatQuestions: settings.chatQuestions
    }
    console.log('[HOME-SETTINGS PUT] Valores nuevos:', JSON.stringify(newValues, null, 2))
    console.log('[HOME-SETTINGS PUT] Settings modificados?:', settings.isModified())
    console.log('[HOME-SETTINGS PUT] Campos modificados:', settings.modifiedPaths())
    
    // Asegurarse de que el modelo Book está registrado
    if (!mongoose.models.Book) {
      console.log('[HOME-SETTINGS PUT] Registrando modelo Book')
      // El modelo ya debería estar registrado por el import, pero por si acaso
    }
    
    console.log('[HOME-SETTINGS PUT] Guardando settings...')
    console.log('[HOME-SETTINGS PUT] Estado de la conexión antes de guardar:', mongoose.connection.readyState)
    
    try {
      const savedSettings = await settings.save()
      console.log('[HOME-SETTINGS PUT] Settings guardados exitosamente')
      console.log('[HOME-SETTINGS PUT] ID guardado:', savedSettings._id)
      console.log('[HOME-SETTINGS PUT] Valores guardados:', JSON.stringify(savedSettings.toObject(), null, 2))
      
      // Verificar que realmente se guardó
      const verification = await HomeSettings.findById(savedSettings._id)
      console.log('[HOME-SETTINGS PUT] Verificación post-guardado:', verification ? 'Encontrado' : 'NO ENCONTRADO')
      if (verification) {
        console.log('[HOME-SETTINGS PUT] Datos verificados:', JSON.stringify(verification.toObject(), null, 2))
      }
    } catch (saveError) {
      console.error('[HOME-SETTINGS PUT] Error al guardar:', saveError)
      console.error('[HOME-SETTINGS PUT] Tipo de error:', saveError instanceof Error ? saveError.constructor.name : 'Unknown')
      console.error('[HOME-SETTINGS PUT] Save error stack:', saveError instanceof Error ? saveError.stack : 'No stack')
      console.error('[HOME-SETTINGS PUT] Estado de conexión en error:', mongoose.connection.readyState)
      throw saveError
    }

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
