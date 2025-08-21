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
        if (child instanceof THREE.Object3D && 'raycast' in child) {
          // Guardar el raycast original si no lo hemos guardado
          if (!child.userData.originalRaycast) {
            child.userData.originalRaycast = child.raycast
          }
          // Desactivar o restaurar raycast según el estado
          (child as any).raycast = isActive ? child.userData.originalRaycast : () => {}
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
          {/* Renderizar SIEMPRE basado en currentScene, sin importar isTransitioning */}
          {currentScene === 'home' && <MainScene />}
          {currentScene === 'catalog' && <CatalogScene />}
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

    </div>
  )
}
