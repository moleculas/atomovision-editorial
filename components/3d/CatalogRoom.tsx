import { useRef } from 'react'
import { Group } from 'three'
import { Floor } from './Floor'
import { Shelf } from './Shelf'
import { Text } from '@react-three/drei'

export function CatalogRoom() {
  const groupRef = useRef<Group>(null)

  // Configuración de estanterías en forma de U
  const shelves = [
    // Pared izquierda
    { position: [-6, 0, -2], rotation: [0, Math.PI / 2, 0], category: 'Ficción' },
    { position: [-6, 0, 2], rotation: [0, Math.PI / 2, 0], category: 'Novela' },
    
    // Pared del fondo
    { position: [-3, 0, -6], rotation: [0, 0, 0], category: 'Ensayo' },
    { position: [0, 0, -6], rotation: [0, 0, 0], category: 'Novedades' },
    { position: [3, 0, -6], rotation: [0, 0, 0], category: 'Poesía' },
    
    // Pared derecha
    { position: [6, 0, -2], rotation: [0, -Math.PI / 2, 0], category: 'Historia' },
    { position: [6, 0, 2], rotation: [0, -Math.PI / 2, 0], category: 'Infantil' },
    
    // Estanterías centrales
    { position: [0, 0, 0], rotation: [0, 0, 0], category: 'Destacados' },
  ]

  return (
    <group ref={groupRef}>
      <Floor />

      {/* Estanterías */}
      {shelves.map((shelf, index) => (
        <Shelf
          key={index}
          position={shelf.position as [number, number, number]}
          rotation={shelf.rotation as [number, number, number]}
          category={shelf.category}
        />
      ))}

      {/* Letrero de entrada */}
      <Text
        position={[0, 4, 4]}
        fontSize={0.5}
        color="#333"
        anchorX="center"
        anchorY="middle"
        font="/fonts/playfair-display.woff"
      >
        Catálogo AtomoVisión
      </Text>

      {/* Decoración: mesas de lectura */}
      <mesh position={[-3, 0.5, 3]} castShadow>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#8B5A3C" />
      </mesh>
      <mesh position={[3, 0.5, 3]} castShadow>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#8B5A3C" />
      </mesh>

      {/* Sillas */}
      {[-3, 3].map((x) => 
        [-0.7, 0.7].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, 3 + z]}>
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.4, 0.05, 0.4]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
            <mesh position={[0, 0.15, 0]} castShadow>
              <boxGeometry args={[0.05, 0.3, 0.05]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}
