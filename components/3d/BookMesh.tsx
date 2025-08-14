import { useRef, useState } from 'react'
import { Box, Text } from '@react-three/drei'
import { Mesh } from 'three'
import { Book } from '@/types'

interface BookMeshProps {
  book: Book
  position: [number, number, number]
  rotation?: [number, number, number]
}

export function BookMesh({ book, position, rotation = [0, 0, 0] }: BookMeshProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Colores aleatorios para las portadas
  const bookColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF']
  const color = bookColors[parseInt(book.id) % bookColors.length]

  return (
    <group position={position} rotation={rotation}>
      <Box
        ref={meshRef}
        args={[0.5, 0.7, 0.1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => console.log('Book clicked:', book.title)}
      >
        <meshStandardMaterial
          color={color}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Box>

      {/* Título en el lomo */}
      <Text
        position={[0, 0, 0.06]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.4}
        textAlign="center"
      >
        {book.title.split(' ').slice(0, 2).join(' ')}
      </Text>
    </group>
  )
}
