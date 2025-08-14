'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CreativeSingularityProps {
  position?: [number, number, number]
  scale?: number
}

export function CreativeSingularity({ 
  position = [0, 0, 0], 
  scale = 1 
}: CreativeSingularityProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Rotar núcleo
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.1
      meshRef.current.rotation.y = time * 0.15
      
      // Pulso de escala
      const pulse = Math.sin(time * 2) * 0.1 + 1
      meshRef.current.scale.setScalar(scale * pulse)
    }
    
    // Rotar partículas
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05
      particlesRef.current.rotation.z = Math.sin(time * 0.3) * 0.1
    }
    
    // Animar glow
    if (glowRef.current && glowRef.current.material) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.1 + Math.sin(time * 3) * 0.05
    }
  })
  
  // Crear geometría de partículas
  const particlesGeometry = new THREE.BufferGeometry()
  const count = 500
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 2 + Math.random() * 3
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  return (
    <group position={position}>
      {/* Núcleo de energía */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Aura brillante */}
      <mesh ref={glowRef} scale={[3, 3, 3]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Anillo adicional */}
      <mesh scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Partículas orbitando */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      
      {/* Luz emanando del núcleo */}
      <pointLight
        color="#ff00ff"
        intensity={2}
        distance={20}
        decay={2}
      />
      <pointLight
        color="#00ffff"
        intensity={1.5}
        distance={15}
        decay={2}
      />
    </group>
  )
}
