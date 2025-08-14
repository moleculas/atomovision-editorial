import { useRef, useState } from 'react'
import { Sphere, Text, Billboard } from '@react-three/drei'
import { Mesh } from 'three'

interface HotspotProps {
  id: string
  position: [number, number, number]
  label: string
  color: string
}

export function Hotspot({ id, position, label, color }: HotspotProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    console.log('Hotspot clicked:', id)
  }

  return (
    <group position={position}>
      {/* Esfera interactiva */}
      <Sphere
        ref={meshRef}
        args={[0.3, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Etiqueta */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.2}
          color={hovered ? '#ffffff' : color}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Billboard>
    </group>
  )
}
