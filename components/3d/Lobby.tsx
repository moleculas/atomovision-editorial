import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Float } from '@react-three/drei'
import { Shelf } from './Shelf'
import { Hotspot } from './Hotspot'
import { Floor } from './Floor'
import { BookTotem } from './BookTotem'

export function Lobby() {
  const groupRef = useRef<Group>(null)

  // Animación suave de rotación
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
    }
  })

  // Configuración de las estanterías
  const shelves = [
    { position: [-5, 0, -3], rotation: [0, Math.PI / 6, 0], category: 'Ficción' },
    { position: [5, 0, -3], rotation: [0, -Math.PI / 6, 0], category: 'Ensayo' },
    { position: [0, 0, -8], rotation: [0, 0, 0], category: 'Novedades' },
  ]

  // Configuración de hotspots
  const hotspots = [
    { id: 'fiction', position: [-5, 2, -3], label: 'Ficción', color: '#FF6B6B' },
    { id: 'essay', position: [5, 2, -3], label: 'Ensayo', color: '#4ECDC4' },
    { id: 'new', position: [0, 2, -8], label: 'Novedades', color: '#FFE66D' },
    { id: 'catalog', position: [0, 3, 0], label: 'Catálogo completo', color: '#95E1D3' },
  ]

  return (
    <group ref={groupRef}>
      {/* Suelo */}
      <Floor />

      {/* Totem central */}
      <Float
        speed={2}
        rotationIntensity={0.2}
        floatIntensity={0.3}
      >
        <BookTotem position={[0, 1, 0]} />
      </Float>

      {/* Estanterías */}
      {shelves.map((shelf, index) => (
        <Shelf
          key={index}
          position={shelf.position as [number, number, number]}
          rotation={shelf.rotation as [number, number, number]}
          category={shelf.category}
        />
      ))}

      {/* Hotspots interactivos */}
      {hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          id={hotspot.id}
          position={hotspot.position as [number, number, number]}
          label={hotspot.label}
          color={hotspot.color}
        />
      ))}

      {/* Decoración adicional - Columnas */}
      <mesh position={[-8, 2, 0]} castShadow>
        <boxGeometry args={[0.5, 4, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[8, 2, 0]} castShadow>
        <boxGeometry args={[0.5, 4, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Paredes laterales con textura */}
      <mesh position={[-10, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 20]} />
        <meshStandardMaterial color="#F5E6D3" />
      </mesh>
      <mesh position={[10, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 20]} />
        <meshStandardMaterial color="#F5E6D3" />
      </mesh>

      {/* Pared del fondo */}
      <mesh position={[0, 2, -10]} receiveShadow>
        <boxGeometry args={[20, 4, 0.2]} />
        <meshStandardMaterial color="#F5E6D3" />
      </mesh>

      {/* Techo con tragaluces */}
      <mesh position={[0, 4, 0]} receiveShadow>
        <boxGeometry args={[20, 0.2, 20]} />
        <meshStandardMaterial color="#FFFFFF" opacity={0.9} transparent />
      </mesh>
    </group>
  )
}
