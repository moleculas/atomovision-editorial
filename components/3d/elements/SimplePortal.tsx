'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface SimplePortalProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  color: string
  label: string
  destination: string
}

export function SimplePortal({
  position,
  rotation = [0, 0, 0],
  color,
  label,
  destination
}: SimplePortalProps) {
  const portalRef = useRef<THREE.Group>(null)
  const ringRef1 = useRef<THREE.Mesh>(null)
  const ringRef2 = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Rotar anillos del portal
    if (ringRef1.current) {
      ringRef1.current.rotation.z = time * 0.5
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -time * 0.3
    }
    
    // Efecto hover
    if (portalRef.current) {
      const scale = hovered ? 1.1 : 1
      portalRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })
  
  const handleClick = () => {
    console.log(`Portal clicked: ${destination}`)
    // TODO: Implementar transición a otra escena
  }
  
  return (
    <group
      ref={portalRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Anillo exterior */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.5, 0.1, 8, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Anillo interior */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[2, 0.05, 8, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Centro del portal */}
      <mesh>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Etiqueta del portal */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
        visible={hovered}
      >
        {label}
      </Text>
      
      {/* Luz del portal */}
      <pointLight
        color={color}
        intensity={hovered ? 3 : 1.5}
        distance={10}
        decay={2}
      />
    </group>
  )
}
