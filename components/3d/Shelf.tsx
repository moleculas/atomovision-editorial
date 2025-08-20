import { useRef } from 'react'
import { Box, Text } from '@react-three/drei'
import { Mesh } from 'three'
import { BookMesh } from './BookMesh'

interface ShelfProps {
  position: [number, number, number]
  rotation: [number, number, number]
  category: string
}

export function Shelf({ position, rotation, category }: ShelfProps) {
  const shelfRef = useRef<Mesh>(null)
  
  // Por ahora, no mostraremos libros reales en las estanterías 3D
  // TODO: Implementar carga asíncrona de libros por categoría
  const books: any[] = []

  return (
    <group position={position} rotation={rotation}>
      {/* Estructura de la estantería */}
      <Box ref={shelfRef} args={[4, 0.1, 0.8]} castShadow receiveShadow>
        <meshStandardMaterial color="#8B5A3C" />
      </Box>
      
      {/* Soportes laterales */}
      <Box position={[-1.9, -0.5, 0]} args={[0.1, 1, 0.8]} castShadow>
        <meshStandardMaterial color="#8B5A3C" />
      </Box>
      <Box position={[1.9, -0.5, 0]} args={[0.1, 1, 0.8]} castShadow>
        <meshStandardMaterial color="#8B5A3C" />
      </Box>

      {/* Libros */}
      {books.map((book, index) => (
        <BookMesh
          key={book.id}
          book={book}
          position={[-1.5 + index * 0.7, 0.4, 0]}
          rotation={[0, Math.random() * 0.2 - 0.1, 0]}
        />
      ))}

      {/* Etiqueta de categoría */}
      <Text
        position={[0, 1.2, 0.5]}
        fontSize={0.3}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {category}
      </Text>
    </group>
  )
}
