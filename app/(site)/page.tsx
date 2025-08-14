'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import { useUIStore } from '@/lib/store'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Fallback2D } from '@/components/ui/Fallback2D'

// Carga dinámica del componente 3D
const SceneManager = dynamic(() => import('@/components/3d/SceneManager').then(mod => ({ default: mod.SceneManager })), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const viewMode = useUIStore((state) => state.viewMode)

  useEffect(() => {
    setMounted(true)
    console.log('HomePage mounted, viewMode:', viewMode)
  }, [viewMode])

  if (!mounted) {
    return <LoadingScreen />
  }

  if (viewMode === '2d') {
    return <Fallback2D />
  }

  return (
    <div className="relative w-full h-screen">
      <Suspense fallback={<LoadingScreen />}>
        <SceneManager />
      </Suspense>
      
      {/* Overlay con información */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white z-20">
        <h1 className="text-4xl md:text-6xl font-playfair mb-4 drop-shadow-lg">
          Bienvenido a AtomoVisión
        </h1>
        <p className="text-lg md:text-xl mb-6 text-white font-medium drop-shadow-lg">
          Explora nuestra colección en un espacio inmersivo
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/catalog'}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Explorar Catálogo
          </button>
          <button className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-colors">
            Ver Novedades
          </button>
        </div>
      </div>

      {/* Indicador de navegación */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-black/80 px-3 py-2 rounded-lg backdrop-blur-sm">
          <p className="text-white/90 text-xs font-medium">Click y arrastra para navegar</p>
          <p className="text-white/90 text-xs font-medium">Scroll para zoom</p>
        </div>
      </div>

      {/* Botón de fallback para debug */}
      <div className="absolute top-20 right-4 z-20">
        <button
          onClick={() => useUIStore.getState().setViewMode('2d')}
          className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
        >
          Cambiar a modo 2D
        </button>
      </div>
    </div>
  )
}
