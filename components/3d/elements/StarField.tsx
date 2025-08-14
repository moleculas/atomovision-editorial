'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface StarFieldProps {
  count?: number
  radius?: number
}

export function StarField({ count = 2000, radius = 50 }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Posición aleatoria en esfera
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius + Math.random() * radius * 0.5
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      
      // Color variado (azulado a blanco)
      const colorIntensity = Math.random()
      colors[i * 3] = 0.5 + colorIntensity * 0.5
      colors[i * 3 + 1] = 0.7 + colorIntensity * 0.3
      colors[i * 3 + 2] = 1
    }
    
    return { positions, colors }
  }, [count, radius])
  
  useFrame((state) => {
    if (pointsRef.current) {
      // Rotación muy lenta del campo estelar
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05
    }
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
