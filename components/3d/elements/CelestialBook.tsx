'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Box, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Book } from '@/types'
import { useRouter } from 'next/navigation'

interface CelestialBookProps {
  book: Book
  position: [number, number, number]
  rotation?: [number, number, number]
  orbitSpeed?: number
}

export function CelestialBook({ 
  book, 
  position, 
  rotation = [0, 0, 0],
  orbitSpeed = 0.1 
}: CelestialBookProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const router = useRouter()
  
  // Colores basados en las categorías
  const getBookColor = () => {
    if (book.categories.includes('Ciencia Ficción')) return '#00ffff'
    if (book.categories.includes('Fantasía')) return '#ff00ff'
    if (book.categories.includes('Terror')) return '#ff0000'
    return '#ffff00'
  }
  
  const color = getBookColor()
  
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
  
  const handleClick = () => {
    setClicked(true)
    setTimeout(() => {
      router.push(`/book/${book.slug}`)
    }, 500)
  }
  
  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Libro como objeto celestial */}
      <Box args={[1.2, 1.6, 0.3]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      
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
      
      {/* Partículas orbitando el libro */}
      {hovered && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const x = Math.cos(angle) * 1
            const z = Math.sin(angle) * 1
            return (
              <mesh key={i} position={[x, 0, z]}>
                <sphereGeometry args={[0.05]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.8}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            )
          })}
        </>
      )}
      
      {/* Título flotante */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        visible={hovered}
      >
        {book.title}
      </Text>
      
      {/* Información al hacer hover */}
      {hovered && (
        <Html
          position={[0, -1.5, 0]}
          center
          style={{
            opacity: clicked ? 0 : 1,
            transform: `scale(${clicked ? 0.5 : 1})`,
            transition: 'all 0.3s',
          }}
        >
          <div className="bg-black/80 text-white p-2 rounded-lg text-xs whitespace-nowrap">
            <p className="font-bold">{book.authors.join(', ')}</p>
            <p className="text-cyan-400">{book.price / 100}€</p>
          </div>
        </Html>
      )}
      
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
