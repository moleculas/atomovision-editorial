'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useNavigationStore } from '@/store/navigation'

export function TransitionCamera() {
  const { isTransitioning, transitionProgress, currentScene, previousScene } = useNavigationStore()
  const { camera } = useThree()
  const originalPosition = useRef(new THREE.Vector3())
  const originalFov = useRef(60)
  const originalRotation = useRef(new THREE.Euler())
  
  useEffect(() => {
    // Solo guardar la posición original cuando estamos en home y NO transitando
    if (currentScene === 'home' && !isTransitioning) {
      originalPosition.current.copy(camera.position)
      originalRotation.current.copy(camera.rotation)
      if (camera instanceof THREE.PerspectiveCamera) {
        originalFov.current = camera.fov
      }
    }
  }, [currentScene, isTransitioning, camera])
  
  useFrame(() => {
    if (!isTransitioning) return
    
    // Solo animar durante la transición de home a catalog
    if (previousScene === 'home' && currentScene === 'home') {
      // Fase 1: Zoom suave (0-0.6)
      if (transitionProgress < 0.6) {
        const zoomProgress = transitionProgress / 0.6
        const eased = easeInOutCubic(zoomProgress)
        
        // Acercar la cámara al átomo
        const targetPos = new THREE.Vector3(0, 0, 5)
        camera.position.lerpVectors(originalPosition.current, targetPos, eased)
        
        // Aumentar FOV ligeramente para sensación de inmersión
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = THREE.MathUtils.lerp(originalFov.current, 90, eased)
          camera.updateProjectionMatrix()
        }
      }
      
      // Fase 2: Distorsión simple (0.6-1.0)
      if (transitionProgress >= 0.6) {
        const distortProgress = (transitionProgress - 0.6) / 0.4
        
        // Rotación suave en Z para efecto de distorsión
        camera.rotation.z = Math.sin(distortProgress * Math.PI) * 0.3
        
        // Vibración sutil
        const shake = Math.sin(distortProgress * Math.PI * 4) * 0.1 * (1 - distortProgress)
        camera.position.x = shake
        camera.position.y = originalPosition.current.y + shake
      }
    }
  })
  
  return null
}

// Función de easing suave
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}
