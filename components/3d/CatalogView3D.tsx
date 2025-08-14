'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OrbitControls, Environment } from '@react-three/drei'
import { useUIStore } from '@/lib/store'
import { CatalogRoom } from './CatalogRoom'
import { Lighting } from './Lighting'

export function CatalogView3D() {
  const performanceMode = useUIStore((state) => state.performanceMode)

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 3, 8], fov: 60 }}
        shadows={performanceMode !== 'low'}
      >
        <Suspense fallback={null}>
          <Lighting performanceMode={performanceMode} />
          
          <Environment
            preset={performanceMode === 'high' ? 'apartment' : 'city'}
            background={false}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            makeDefault
          />

          <CatalogRoom />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-20 left-4 bg-card/90 backdrop-blur rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Navegación</h2>
        <p className="text-sm text-muted-foreground">Click en las estanterías para explorar</p>
        <p className="text-sm text-muted-foreground">Arrastra para rotar la vista</p>
      </div>
    </div>
  )
}
