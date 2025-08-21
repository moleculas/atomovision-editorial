'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbitalRingProps {
  radius: number
  height: number
  speed: number
  opacity?: number
  color?: string
}

export function OrbitalRing({ 
  radius, 
  height, 
  speed, 
  opacity = 0.3,
  color = '#00ffff'
}: OrbitalRingProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += speed * 0.01
    }
    if (glowRef.current) {
      glowRef.current.rotation.z -= speed * 0.01
      // Pulso de opacidad
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * pulse
    }
  })
  
  return (
    <group position={[0, height, 0]}>
      {/* Anillo principal */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.1, 8, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Brillo del anillo */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.5, 8, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Partículas en el anillo */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={color}
              emissiveIntensity={2}
            />
          </mesh>
        )
      })}
    </group>
  )
}
