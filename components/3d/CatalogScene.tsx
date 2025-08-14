'use client'

import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigationStore } from '@/store/navigation'

export function CatalogScene() {
  const { camera } = useThree()
  const { currentScene, sharedTexture } = useNavigationStore()
  
  useEffect(() => {
    // Solo modificar la cámara si esta escena está activa
    if (currentScene === 'catalog') {
      console.log('CatalogScene activa - ajustando cámara')
      // Posicionar la cámara en el centro de la esfera
      camera.position.set(0, 0, 0)
      camera.lookAt(0, 0, -1)
      camera.rotation.set(0, 0, 0)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 75
        camera.updateProjectionMatrix()
      }
    }
  }, [camera, currentScene])
  
  return (
    <>
      {/* Luz ambiental */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} />
      
      {/* Esfera invertida - estamos dentro mirando hacia afuera */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[30, 64, 64]} />
        {sharedTexture ? (
          <meshBasicMaterial 
            map={sharedTexture}
            side={THREE.BackSide}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial 
            color="#1a1a2e"
            side={THREE.BackSide}
          />
        )}
      </mesh>
      
      {/* Elementos flotantes dentro de la esfera */}
      <mesh position={[0, 0, -5]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#ff00ff" />
      </mesh>
      
      <mesh position={[3, 2, -4]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
      
      <mesh position={[-3, -1, -6]}>
        <coneGeometry args={[1, 2, 32]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Controles limitados para explorar el interior */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={0.1}
        maxDistance={20}
        target={[0, 0, -5]}
      />
    </>
  )
}
