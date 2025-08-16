'use client'

import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigationStore } from '@/store/navigation'

// Array de géneros literarios
const GENEROS_LITERARIOS = [
  "Ficción especulativa",
  "Ciencia ficción",
  "Fantasía",
  "Ciencia ficción dura",
  "Ciencia ficción blanda",
  "Ciencia ficción social",
  "Space opera",
  "Space opera militar",
  "Ciencia ficción militar",
  "Ciberpunk",
  "Steampunk",
  "Biopunk",
  "Dieselpunk",
  "Atompunk",
  "Clockpunk",
  "Postcyberpunk",
  "Ucronía",
  "Ciencia ficción apocalíptica",
  "Ciencia ficción postapocalíptica",
  "Mundos moribundos",
  "Distopía",
  "Utopía",
  "Utopías ambiguas",
  "Viaje en el tiempo",
  "Ciencia ficción de exploración espacial y colonización",
  "Primer contacto",
  "Ciencia ficción antropológica",
  "Narrativas especulativas",
  "Ciencia ficción humorística",
  "Ciencia ficción filosófica",
  "Slipstream",
  "Ciencia ficción policíaca",
  "Ciencia ficción bélica",
  "Ciencia ficción gótica",
  "Space western",
  "Fantasía científica",
  "Climate fiction",
  "Solarpunk",
  "Hopepunk",
  "Ciencia ficción especulativa",
  "Alta fantasía",
  "Fantasía épica",
  "Fantasía heroica",
  "Espada y brujería",
  "Baja fantasía",
  "Fantasía oscura",
  "Grimdark",
  "Fantasía urbana",
  "Realismo mágico",
  "Fantasía histórica",
  "Cuentos de hadas",
  "Fantasía de hadas",
  "Fantasía mitológica",
  "Fantasía de romance paranormal",
  "Fantasía erótica",
  "Fantasía cómica",
  "Fantasía juvenil e infantil",
  "Noblebright",
  "New Weird",
  "Silkpunk",
  "Fantaterror",
  "Afro-fantasía",
  "Afrofantasy",
  "Xianxia",
  "Wuxia",
  "Isekai",
  "Fantasía asiática",
  "Fantasía europea no anglosajona",
  "Fantasía celta",
  "Fantasía latinoamericana",
  "Fantasía LGBTQ+",
  "Proto-ciencia ficción",
  "Proto-fantasía",
  "Mitología y epopeyas",
  "Novelas de caballerías",
  "Novelas góticas",
  "Romances científicos",
  "Literatura pulp",
  "Horror cósmico",
  "Afrofuturismo",
  "Fantastika",
  "K-fantasy",
  "Light novels",
  "Manga",
  "Anime",
  "Mecha"
]

// Componente para el cúmulo molecular
function MolecularCluster({ texture }: { texture?: THREE.Texture | null }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredSphere, setHoveredSphere] = useState<number | null>(null)
  const { camera, scene, gl } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  
  // Generar las posiciones y tamaños de las esferas basado en los géneros
  const spheres = useMemo(() => {
    const sphereData = []
    
    for (let i = 0; i < GENEROS_LITERARIOS.length; i++) {
      // Tamaños variados pero no muy distantes (entre 0.3 y 0.8)
      const radius = 0.3 + Math.random() * 0.5
      
      // Posición inicial
      let position = new THREE.Vector3()
      
      if (i === 0) {
        // La primera esfera siempre en el centro
        position.set(0, 0, 0)
      } else {
        // Elegir una esfera existente al azar
        const targetSphere = sphereData[Math.floor(Math.random() * sphereData.length)]
        const direction = new THREE.Vector3(
          (Math.random() - 0.5),
          (Math.random() - 0.5),
          (Math.random() - 0.5)
        ).normalize()
        
        // Posicionar cerca de la esfera objetivo (con algo de solapamiento)
        const distance = targetSphere.radius + radius * 0.7 // 0.7 para crear solapamiento
        position = targetSphere.position.clone().add(direction.multiplyScalar(distance))
      }
      
      sphereData.push({
        position,
        radius,
        id: i,
        genero: GENEROS_LITERARIOS[i] // Asignar el género correspondiente
      })
    }
    
    // Calcular el centro de masa del cúmulo
    const center = new THREE.Vector3()
    sphereData.forEach(sphere => {
      center.add(sphere.position)
    })
    center.divideScalar(sphereData.length)
    
    // Centrar todo el cúmulo
    sphereData.forEach(sphere => {
      sphere.position.sub(center)
    })
    
    return sphereData
  }, [])
  
  // Manejar hover con detección de profundidad
  const handlePointerOver = (e: any, sphereId: number) => {
    e.stopPropagation()
    
    // Obtener la posición del mouse
    const pointer = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1
    )
    
    // Configurar el raycaster
    raycaster.setFromCamera(pointer, camera)
    
    // Obtener todas las intersecciones con las esferas del grupo
    if (groupRef.current) {
      const intersects = raycaster.intersectObjects(groupRef.current.children, true)
      
      // Si la primera intersección es la esfera actual, activar hover
      if (intersects.length > 0 && intersects[0].object.userData.sphereId === sphereId) {
        setHoveredSphere(sphereId)
        gl.domElement.style.cursor = 'pointer'
      }
    }
  }
  
  const handlePointerOut = () => {
    setHoveredSphere(null)
    gl.domElement.style.cursor = 'auto'
  }
  
  // Limpiar cursor al desmontar
  useEffect(() => {
    return () => {
      gl.domElement.style.cursor = 'auto'
    }
  }, [gl])
  
  // Animación sutil del grupo completo
  useFrame((state) => {
    if (groupRef.current) {
      // Rotación muy lenta del cúmulo completo
      groupRef.current.rotation.y += 0.001
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
      // Pequeña pulsación
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      groupRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {spheres.map((sphere) => {
        const isHovered = hoveredSphere === sphere.id
        
        return (
          <SphereItem
            key={sphere.id}
            sphere={sphere}
            isHovered={isHovered}
            texture={texture}
            onPointerOver={(e) => handlePointerOver(e, sphere.id)}
            onPointerOut={handlePointerOut}
          />
        )
      })}
    </group>
  )
}

// Componente individual para cada esfera con animación
function SphereItem({ sphere, isHovered, texture, onPointerOver, onPointerOut }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [displayedText, setDisplayedText] = useState('')
  
  // Efecto typewriter para el género
  useEffect(() => {
    if (isHovered) {
      setDisplayedText('')
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex <= sphere.genero.length) {
          setDisplayedText(sphere.genero.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, 50) // 50ms entre cada letra
      
      return () => {
        clearInterval(interval)
        setDisplayedText('')
      }
    } else {
      setDisplayedText('')
    }
  }, [isHovered, sphere.genero])
  
  // Animar la escala con lerp
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.15 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )
    }
  })
  
  return (
    <mesh
      ref={meshRef}
      position={sphere.position}
      userData={{ sphereId: sphere.id }}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <sphereGeometry args={[sphere.radius, 64, 64]} />
      {texture ? (
        <meshPhysicalMaterial
          map={texture}                                   // Mantener la textura como map principal
          color="#ffffff"                                // Blanco puro
          metalness={0.3}                                 // Reducido para ver mejor la textura
          roughness={0.05}                                // Muy bajo para máximo brillo
          clearcoat={1}                                   // Máximo recubrimiento brillante
          clearcoatRoughness={0}                          // Recubrimiento perfectamente liso
          reflectivity={1}                                // Máxima reflectividad
          transparent
          opacity={isHovered ? 1 : 0.95}                  // Opacidad muy alta
          emissive={isHovered ? "#808080" : "#404040"}  // Emisión gris para iluminar
          emissiveIntensity={isHovered ? 0.3 : 0.2}      // Mayor intensidad para brillo
          side={THREE.DoubleSide}
        />
      ) : (
        <meshPhysicalMaterial
          color="#f0f0f0"                                // Gris muy claro casi blanco
          metalness={0.5}                                 // Medio metálico
          roughness={0.05}                                // Muy brillante
          clearcoat={1}
          clearcoatRoughness={0}
          reflectivity={1}
          emissive={isHovered ? "#a0a0a0" : "#808080"}  // Emisión gris clara
          emissiveIntensity={isHovered ? 0.3 : 0.2}      // Buena intensidad de brillo
        />
      )}
      
      {/* Tooltip con efecto typewriter */}
      {isHovered && (
        <Html
          position={[0, sphere.radius + 0.15, 0]}
          center
          style={{
            transition: 'opacity 0.3s',
            opacity: isHovered ? 1 : 0,
            pointerEvents: 'none'
          }}
        >
          <div className="bg-black/80 px-3 py-1 rounded-lg backdrop-blur-sm">
            <p className="text-white text-xs font-medium whitespace-nowrap">
              {displayedText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        </Html>
      )}
    </mesh>
  )
}

export function CatalogScene() {
  const { camera } = useThree()
  const { currentScene, sharedTexture } = useNavigationStore()
  const sphereRef = useRef<THREE.Mesh>(null)
  
  useEffect(() => {
    // Solo modificar la cámara si esta escena está activa
    if (currentScene === 'catalog') {
      console.log('CatalogScene activa - ajustando cámara')
      // Posicionar la cámara en el centro de la esfera
      camera.position.set(0, 0, 0)
      camera.lookAt(0, 0, -1)
      camera.rotation.set(0, 0, 0)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = 75
        camera.updateProjectionMatrix()
      }
    }
  }, [camera, currentScene])
  
  // Animación muy lenta de la esfera de fondo
  useFrame((state) => {
    if (sphereRef.current) {
      // Rotación muy lenta en múltiples ejes para crear sensación de flotación
      sphereRef.current.rotation.y += 0.0002  // Reducido de 0.0005 a 0.0002
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.01  // Reducido de 0.1 a 0.05 y de 0.02 a 0.01
      sphereRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.04) * 0.008  // Reducido de 0.08 a 0.04 y de 0.015 a 0.008
    }
  })
  
  return (
    <>
      {/* Luz ambiental más brillante para las burbujas */}
      <ambientLight intensity={1} />
      <pointLight position={[0, 0, 0]} intensity={1.2} />
      {/* Luces adicionales para mejor visualización de las burbujas */}
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ffffff" />
      
      {/* Esfera invertida - estamos dentro mirando hacia afuera */}
      <mesh ref={sphereRef} scale={[-1, 1, 1]}>
        <sphereGeometry args={[30, 64, 64]} />
        {sharedTexture ? (
          <meshBasicMaterial 
            map={sharedTexture}
            side={THREE.BackSide}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial 
            color="#1a1a2e"
            side={THREE.BackSide}
          />
        )}
      </mesh>
      
      {/* Cúmulo molecular de burbujas */}
      <MolecularCluster texture={sharedTexture} />
      
      {/* Controles limitados para explorar el interior */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={0.1}
        maxDistance={20}
        target={[0, 0, -5]}
      />
    </>
  )
}
