'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useNavigationStore } from '@/store/navigation'

export function TransitionEffect() {
  const { isTransitioning, transitionProgress, updateTransitionProgress, completeTransition, previousScene } = useNavigationStore()
  const { camera, scene } = useThree()
  const startTime = useRef(0)
  const startCameraPos = useRef(new THREE.Vector3())
  const startCameraFov = useRef(60)
  
  useEffect(() => {
    if (isTransitioning) {
      startTime.current = Date.now()
      startCameraPos.current.copy(camera.position)
      if (camera instanceof THREE.PerspectiveCamera) {
        startCameraFov.current = camera.fov
      }
    }
  }, [isTransitioning, camera])
  
  useFrame(() => {
    if (!isTransitioning) return
    
    const elapsed = (Date.now() - startTime.current) / 1000 // segundos
    const duration = 2.0 // duración total de la transición
    const progress = Math.min(elapsed / duration, 1)
    
    // Actualizar progreso en el store
    updateTransitionProgress(progress)
    
    // Solo animar si estamos en la escena home
    if (previousScene === 'home') {
      // Fase 1: Zoom hacia el átomo (0-0.7)
      if (progress < 0.7) {
        const zoomProgress = progress / 0.7
        const eased = easeInOutQuart(zoomProgress)
        
        // Mover cámara hacia el centro
        const targetPos = new THREE.Vector3(0, 0, 3)
        camera.position.lerpVectors(startCameraPos.current, targetPos, eased)
        
        // Aumentar FOV para efecto de inmersión
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = startCameraFov.current + (eased * 60) // De 60 a 120
          camera.updateProjectionMatrix()
        }
      }
      
      // Fase 2: Transición dimensional (0.7-1.0)
      if (progress >= 0.7) {
        const dimProgress = (progress - 0.7) / 0.3
        
        // Efecto de distorsión con rotación
        camera.rotation.z = Math.sin(dimProgress * Math.PI) * 0.5
      }
    }
    
    // Completar transición
    if (progress >= 1) {
      // Resetear cámara para la nueva escena
      if (previousScene === 'home') {
        camera.position.set(0, 0, 0)
        camera.rotation.set(0, 0, 0)
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = 60
          camera.updateProjectionMatrix()
        }
      }
      completeTransition()
    }
  })
  
  // Efectos visuales adicionales durante la transición
  useEffect(() => {
    if (!isTransitioning) return
    
    // Añadir fog para efecto de profundidad
    const originalFog = scene.fog
    scene.fog = new THREE.Fog(0x000000, 1, 50)
    
    return () => {
      scene.fog = originalFog
    }
  }, [isTransitioning, scene])
  
  return null
}

// Función de easing más dramática
function easeInOutQuart(t: number): number {
  return t < 0.5
    ? 8 * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 4) / 2
}
