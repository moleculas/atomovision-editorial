import { useRef } from 'react'
import { Box, Text } from '@react-three/drei'
import { Mesh } from 'three'

interface BookTotemProps {
  position: [number, number, number]
}

export function BookTotem({ position }: BookTotemProps) {
  const meshRef = useRef<Mesh>(null)

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 0.2, 32]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Libro principal */}
      <Box
        ref={meshRef}
        args={[1.2, 1.6, 0.2]}
        onClick={() => console.log('Totem clicked')}
        castShadow
      >
        <meshStandardMaterial
          color="#E74C3C"
          metalness={0.3}
          roughness={0.4}
          emissive="#E74C3C"
          emissiveIntensity={0.1}
        />
      </Box>

      {/* Título */}
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Libro del Mes
      </Text>
    </group>
  )
}
