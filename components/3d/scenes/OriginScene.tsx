'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function OriginScene() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Esfera central simple */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Algunos cubos orbitando */}
      <mesh position={[5, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00ffff" />
      </mesh>
      
      <mesh position={[-5, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      
      <mesh position={[0, 0, 5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      
      {/* Luz ambiental */}
      <ambientLight intensity={0.5} />
      
      {/* Luz puntual */}
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Fondo */}
      <mesh>
        <boxGeometry args={[50, 50, 50]} />
        <meshBasicMaterial color="#000033" side={THREE.BackSide} />
      </mesh>
    </group>
  )
}
