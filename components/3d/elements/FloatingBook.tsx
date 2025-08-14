'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface FloatingBookProps {
  position: [number, number, number]
  title: string
  color: string
  orbitSpeed?: number
}

export function FloatingBook({ 
  position, 
  title,
  color,
  orbitSpeed = 0.1 
}: FloatingBookProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Rotación propia
      meshRef.current.rotation.y += orbitSpeed * 0.01
      
      // Efecto hover
      const scale = hovered ? 1.2 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
      
      // Levitación suave
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
    }
  })
  
  return (
    <group
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Libro */}
      <mesh>
        <boxGeometry args={[1.2, 1.6, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Aura de energía */}
      <mesh scale={[2, 2.5, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Título flotante */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={hovered}
      >
        {title}
      </Text>
      
      {/* Luz propia del libro */}
      <pointLight
        color={color}
        intensity={hovered ? 1 : 0.5}
        distance={5}
        decay={2}
      />
    </group>
  )
}
