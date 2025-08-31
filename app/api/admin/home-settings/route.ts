import { NextRequest, NextResponse } from 'next/server'
import { connectMongoose } from '@/lib/mongodb/client'
import HomeSettings from '@/lib/mongodb/models/HomeSettings'
import mongoose from 'mongoose'
import { ensureModelsAreRegistered } from '@/lib/mongodb/models'

// GET - Obtener configuración de la home
export async function GET(_request: NextRequest) {
  try {
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    
    // Asegurar que todos los modelos estén registrados
    ensureModelsAreRegistered()

    // Buscar la configuración o crear una por defecto
    let settings = await HomeSettings.findOne().populate('featuredBookId')
    
    if (!settings) {
      settings = await HomeSettings.create({})
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('[HOME-SETTINGS GET] Error:', error instanceof Error ? error.message : 'Error desconocido')
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
    // TODO: Verificar autenticación de admin
    
    await connectMongoose()
    
    // Asegurar que todos los modelos estén registrados
    ensureModelsAreRegistered()
    
    const body = await request.json()
    
    // Validar featuredBookId si existe
    if (body.featuredBookId && body.featuredBookId !== '') {
      // Verificar que es un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(body.featuredBookId)) {
        return NextResponse.json(
          { error: 'featuredBookId inválido' },
          { status: 400 }
        )
      }
    }
    
    // Buscar o crear la configuración
    let settings
    try {
      settings = await HomeSettings.findOne()
    } catch (findError) {
      console.error('[HOME-SETTINGS PUT] Error al buscar settings:', findError)
      throw findError
    }
    
    if (!settings) {
      settings = new HomeSettings()
    }

    // Actualizar campos
    if (body.featuredBookId !== undefined) {
      settings.featuredBookId = body.featuredBookId === '' ? null : body.featuredBookId
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
    
    // Asegurarse de que el modelo Book está registrado
    if (!mongoose.models.Book) {
      // El modelo ya debería estar registrado por el import, pero por si acaso
    }
    
    try {
      const savedSettings = await settings.save()
      
      // Verificar que realmente se guardó
      const verification = await HomeSettings.findById(savedSettings._id)
      if (!verification) {
        throw new Error('Error al verificar el guardado')
      }
    } catch (saveError) {
      console.error('[HOME-SETTINGS PUT] Error al guardar:', saveError)
      throw saveError
    }

    // Retornar con el libro poblado
    await settings.populate('featuredBookId')

    return NextResponse.json({ 
      message: 'Configuración actualizada correctamente',
      settings 
    })
  } catch (error) {
    console.error('[HOME-SETTINGS PUT] Error:', error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json(
      { 
        error: 'Error al actualizar configuración',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
