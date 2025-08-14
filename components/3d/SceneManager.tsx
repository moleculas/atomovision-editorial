'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import * as THREE from 'three'
import { useNavigationStore } from '@/store/navigation'
import { MainScene } from './Scene'
import { CatalogScene } from './CatalogScene'
import { SCENE_CONFIG } from '@/constants'

// Componente wrapper para controlar la interactividad
function SceneWrapper({ children, isActive }: { children: React.ReactNode, isActive: boolean }) {
  return (
    <group 
      visible={isActive}
      traverse={(child) => {
        // Desactivar eventos de pointer en todos los hijos cuando no está activo
        if ('onPointerOver' in child || 'onPointerOut' in child || 'onClick' in child) {
          child.raycast = isActive ? child.raycast : () => {}
        }
      }}
    >
      {children}
    </group>
  )
}

export function SceneManager() {
  const { currentScene, isTransitioning, transitionProgress } = useNavigationStore()
  
  // Debug
  useEffect(() => {
    console.log('=== SceneManager Debug ===')
    console.log('currentScene:', currentScene)
    console.log('isTransitioning:', isTransitioning)
    console.log('transitionProgress:', transitionProgress)
    console.log('========================')
  }, [currentScene, isTransitioning, transitionProgress])
  
  return (
    <div className="w-full h-screen relative">
      <Canvas 
        camera={{ 
          position: SCENE_CONFIG.CAMERA.position as [number, number, number], 
          fov: SCENE_CONFIG.CAMERA.fov 
        }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
        onCreated={({ camera }) => {
          console.log('Canvas created - Camera position:', camera.position)
          console.log('Camera config:', SCENE_CONFIG.CAMERA)
        }}
      >
        <Suspense fallback={null}>
          {/* Durante la transición, mostrar la escena desde la que venimos */}
          {isTransitioning && (
            <>
              {/* Usar previousScene en lugar de currentScene */}
              <MainScene />
            </>
          )}
          
          {/* Cuando NO hay transición, mostrar la escena actual */}
          {!isTransitioning && (
            <>
              {currentScene === 'home' && <MainScene />}
              {currentScene === 'catalog' && <CatalogScene />}
            </>
          )}
        </Suspense>
      </Canvas>
      
      {/* Overlay de transición con respuesta inmediata */}
      {(isTransitioning || transitionProgress > 0) && (
        <div 
          className="absolute inset-0 bg-black pointer-events-none z-40"
          style={{ 
            opacity: transitionProgress,
            // Sin transición CSS para que sea instantáneo
          }}
        />
      )}
      
      {/* Debug visual del overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded text-black text-xs z-50">
        <div>Scene: {currentScene}</div>
        <div>Transitioning: {isTransitioning ? 'YES' : 'NO'}</div>
        <div>Progress: {transitionProgress.toFixed(2)}</div>
      </div>
    </div>
  )
}
