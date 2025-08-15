'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Html } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ARCHILLECT_CONFIG, SCENE_CONFIG } from '@/constants'
import { useNavigationStore } from '@/store/navigation'

// Variable global para almacenar los archivos
let archillectFiles: string[] = []

// Componente para cargar el listado
function ArchillectLoader({ onLoaded }: { onLoaded: (files: string[]) => void }) {
  useEffect(() => {
    import('@/constants/listado.js')
      .then((module) => {
        if (module.archivos && Array.isArray(module.archivos)) {
          // FILTRAR SOLO IMÁGENES JPG Y PNG
          const imageFiles = module.archivos.filter((file: string) => {
            const lowerFile = file.toLowerCase()
            return lowerFile.endsWith('.jpg') || lowerFile.endsWith('.jpeg') || lowerFile.endsWith('.png')
          })
          
          archillectFiles = imageFiles
          onLoaded(imageFiles)
        }
      })
      .catch((error) => {
        // Error silencioso
      })
  }, [onLoaded])
  
  return null
}

function ArchillectSphere({ onFirstTextureLoaded }: { onFirstTextureLoaded: (loaded: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasNotifiedFirstLoad = useRef(false)  // Para notificar solo una vez
  const { gl } = useThree()
  const { startTransition } = useNavigationStore()
  
  const fullText = 'Catálogo General AtomoVisión'
  
  // Handler para el click - iniciar transición simple
  const handleClick = () => {
    console.log('=== CLICK EN ESFERA ===')
    
    // PRIMERO: Limpiar el tooltip inmediatamente
    setHovered(false)
    setDisplayedText('')
    
    // Detener el cambio automático de imágenes durante la transición
    setIsTransitioning(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Feedback visual inmediato - cambiar opacidad/escala
    if (meshRef.current) {
      const originalScale = meshRef.current.scale.x
      meshRef.current.scale.setScalar(originalScale * 0.95)
      setTimeout(() => {
        meshRef.current?.scale.setScalar(originalScale)
      }, 200)
    }
    
    // Clonar la textura para evitar que desaparezca del átomo original
    let textureToShare = null
    if (currentTexture) {
      textureToShare = currentTexture.clone()
      textureToShare.needsUpdate = true
    }
    
    startTransition('catalog', textureToShare)
  }
  
  // Manejar cursor
  useEffect(() => {
    if (hovered) {
      gl.domElement.style.cursor = 'pointer'
    } else {
      gl.domElement.style.cursor = 'auto'
    }
    
    return () => {
      gl.domElement.style.cursor = 'auto'
    }
  }, [hovered, gl])
  
  // Efecto typewriter
  useEffect(() => {
    if (hovered) {
      setDisplayedText('')
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex))
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
  }, [hovered])
  
  // Función para cargar imagen
  const loadImage = useCallback((fileName: string) => {
    if (isLoading) return
    
    setIsLoading(true)
    
    const url = `${ARCHILLECT_CONFIG.PHP_PROXY_URL}${encodeURIComponent(fileName)}`
    
    // Limpiar textura anterior SOLO si NO estamos en transición
    if (currentTexture && !isTransitioning) {
      currentTexture.dispose()
    }
    
    // Cargar nueva imagen
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'
    
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        setCurrentTexture(texture)
        setIsLoading(false)
        
        // Notificar que la primera textura se ha cargado
        if (!hasNotifiedFirstLoad.current) {
          hasNotifiedFirstLoad.current = true
          onFirstTextureLoaded(true)
        }
      },
      undefined,
      (error) => {
        setIsLoading(false)
        // Intentar con otra imagen aleatoria
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * archillectFiles.length)
          setCurrentIndex(randomIndex)
        }, 1000)
      }
    )
  }, [isLoading, currentTexture, currentIndex, isTransitioning, onFirstTextureLoaded])
  
  // Cambiar imagen periódicamente
  useEffect(() => {
    if (archillectFiles.length === 0 || isTransitioning) return
    
    const loadRandomImage = () => {
      if (!isLoading && archillectFiles.length > 0 && !isTransitioning) {
        // Seleccionar índice ALEATORIO
        const randomIndex = Math.floor(Math.random() * archillectFiles.length)
        const fileName = archillectFiles[randomIndex]
        loadImage(fileName)
        setCurrentIndex(randomIndex)
      }
    }
    
    // Cargar primera imagen aleatoria
    if (!currentTexture && !isLoading) {
      loadRandomImage()
    }
    
    // Cambiar a imagen aleatoria cada X segundos
    intervalRef.current = setInterval(loadRandomImage, 8000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentTexture, isLoading, loadImage, isTransitioning])
  
  // Animación de la esfera
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * SCENE_CONFIG.SPHERE_ROTATION_SPEED
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      
      // Efecto hover
      const scale = hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })
  
  return (
    <>
      <mesh 
        ref={meshRef} 
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[SCENE_CONFIG.SPHERE_RADIUS, SCENE_CONFIG.SPHERE_SEGMENTS, SCENE_CONFIG.SPHERE_SEGMENTS]} />
        {currentTexture ? (
          <meshBasicMaterial 
            map={currentTexture}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial 
            color="#0a0a0a"
            transparent={true}
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>
      
      {/* Tooltip/Label con efecto typewriter */}
      {hovered && (
        <Html
          position={[2.5, 2.5, 0]}
          center
          style={{
            transition: 'opacity 0.3s',
            opacity: hovered ? 1 : 0,
            pointerEvents: 'none'
          }}
        >
          <div className="bg-black/80 px-4 py-2 rounded-lg backdrop-blur-sm">
            <p className="text-white text-sm font-medium whitespace-nowrap">
              {displayedText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        </Html>
      )}
      
      {/* Auras alrededor de la esfera */}
      <mesh scale={[4, 4, 4]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      <mesh scale={[4.5, 4.5, 4.5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.02}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

function OrbitingSphere({ position, radius, color, orbitRadius, orbitSpeed, phaseOffset = 0, label }: { 
  position: [number, number, number], 
  radius: number, 
  color: string,
  orbitRadius: number,
  orbitSpeed: number,
  phaseOffset?: number,
  label: string 
}) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const { gl, camera, scene } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  
  // Manejar cursor
  useEffect(() => {
    if (hovered) {
      gl.domElement.style.cursor = 'pointer'
    } else {
      gl.domElement.style.cursor = 'auto'
    }
    
    return () => {
      gl.domElement.style.cursor = 'auto'
    }
  }, [hovered, gl])
  
  // Efecto typewriter
  useEffect(() => {
    if (hovered) {
      setDisplayedText('')
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex <= label.length) {
          setDisplayedText(label.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
        }
      }, 50)
      
      return () => {
        clearInterval(interval)
        setDisplayedText('')
      }
    } else {
      setDisplayedText('')
    }
  }, [hovered, label])
  
  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    
    // Verificar si el objeto está oculto detrás de la esfera principal
    if (meshRef.current) {
      const spherePosition = new THREE.Vector3()
      meshRef.current.getWorldPosition(spherePosition)
      
      // Crear un rayo desde la cámara hacia la esfera pequeña
      const direction = spherePosition.clone().sub(camera.position).normalize()
      raycaster.set(camera.position, direction)
      
      // Obtener todas las intersecciones
      const intersects = raycaster.intersectObjects(scene.children, true)
      
      // Buscar si hay una esfera grande antes que la esfera pequeña
      let mainSphereDistance = Infinity
      let smallSphereDistance = Infinity
      
      for (const intersect of intersects) {
        const object = intersect.object
        
        // Identificar la esfera principal por su geometría
        if (object.geometry && 
            object.geometry.type === 'SphereGeometry' && 
            (object.geometry as any).parameters.radius === SCENE_CONFIG.SPHERE_RADIUS) {
          mainSphereDistance = intersect.distance
        }
        
        // Identificar la esfera pequeña actual
        if (object === meshRef.current || object === e.object) {
          smallSphereDistance = intersect.distance
        }
      }
      
      // Solo activar hover si la esfera pequeña está más cerca que la esfera principal
      if (smallSphereDistance < mainSphereDistance) {
        setHovered(true)
      }
    }
  }
  
  const handlePointerOut = () => {
    setHovered(false)
  }
  
  useFrame((state) => {
    if (groupRef.current) {
      if (orbitRadius > 0) {
        // Órbita circular con fase inicial única
        const time = state.clock.elapsedTime * orbitSpeed + phaseOffset
        groupRef.current.position.x = Math.cos(time) * orbitRadius
        groupRef.current.position.z = Math.sin(time) * orbitRadius
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3 + phaseOffset) * 0.15
      } else {
        // Si no hay órbita, solo movimiento vertical flotante
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
      }
    }
    
    if (meshRef.current) {
      // Rotación propia
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      
      const scale = hovered ? 1.2 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhysicalMaterial 
          color={radius === 0.3 ? "#e11d48" : "#6495ED"}  // Rojo para pequeñas, azul cobalto para grandes
          metalness={0.95}  // Muy metálico
          roughness={0.05}  // Muy brillante
          clearcoat={1}     // Capa de barniz
          clearcoatRoughness={0}
          emissive={radius === 0.3 ? "#e11d48" : "#4682b4"}  // Emisión según tamaño
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>
      {/* Aura de la esfera */}
      <mesh scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Tooltip/Label con efecto typewriter */}
      {hovered && (
        <Html
          position={[0, 0.6, 0]}
          center
          style={{
            transition: 'opacity 0.3s',
            opacity: hovered ? 1 : 0,
            pointerEvents: 'none',
            cursor: 'pointer'
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
    </group>
  )
}

function OrbitalRing({ radius, height, speed = 0.2, thickness = 0.1, opacity = 0.3 }: { 
  radius: number, 
  height: number, 
  speed?: number,
  thickness?: number,
  opacity?: number 
}) {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed
    }
  })
  
  return (
    <mesh ref={ringRef} position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, thickness, 8, 64]} />
      <meshBasicMaterial
        color="#00ffff"
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function Particles() {
  const points = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = SCENE_CONFIG.PARTICLE_COUNT
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 25
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      colors[i * 3] = 0.5 + Math.random() * 0.5
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3
      colors[i * 3 + 2] = 1
    }
    
    return { positions, colors }
  }, [])
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * SCENE_CONFIG.PARTICLES_ROTATION_SPEED
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05
    }
  })
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={false}
      />
    </points>
  )
}

function MainScene() {
  const [filesLoaded, setFilesLoaded] = useState(false)
  const [firstTextureLoaded, setFirstTextureLoaded] = useState(false)
  
  return (
    <>
      {/* Cargar el listado de archivos */}
      <ArchillectLoader onLoaded={(files) => setFilesLoaded(files.length > 0)} />
      
      {/* Iluminación - siempre visible */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#00ffff" />
      <directionalLight position={[0, 10, 0]} intensity={0.5} />
      
      {/* Partículas y fondo - siempre visibles */}
      <Particles />
      
      {/* Fondo estrellado - siempre visible */}
      <mesh>
        <boxGeometry args={[60, 60, 60]} />
        <meshBasicMaterial color="#000011" side={THREE.BackSide} />
      </mesh>
      
      {/* Contenedor para todos los objetos 3D - solo visible cuando la textura esté cargada */}
      <group visible={firstTextureLoaded}>
        {/* Esfera central */}
        {filesLoaded && <ArchillectSphere onFirstTextureLoaded={setFirstTextureLoaded} />}
        
        {/* Anillos orbitales principales */}
        <OrbitalRing radius={6} height={0} speed={0.2} />
        <OrbitalRing radius={9} height={2} speed={-0.15} />
        <OrbitalRing radius={12} height={-2} speed={0.1} />
        
        {/* Anillos orbitales pequeños para las esferas */}
        <OrbitalRing radius={4.5} height={1} speed={0.25} thickness={0.05} opacity={0.2} />
        <OrbitalRing radius={7.5} height={-1} speed={-0.18} thickness={0.05} opacity={0.2} />
        
        {/* Esferas grandes (antes eran libros) - con efecto metálico cobalto */}
        <OrbitingSphere 
          position={[7, 0, 0]} 
          radius={0.5}  // Más grandes que las pequeñas (0.3)
          color="#6495ED"  // Azul cobalto para todas
          orbitRadius={0}  // Sin órbita, posición fija
          orbitSpeed={0}
          label="Libro 1"
        />
        <OrbitingSphere 
          position={[-7, 0, 0]} 
          radius={0.5} 
          color="#6495ED"  // Azul cobalto
          orbitRadius={0}
          orbitSpeed={0}
          label="Libro 2"
        />
        <OrbitingSphere 
          position={[0, 0, 7]} 
          radius={0.5} 
          color="#6495ED"  // Azul cobalto
          orbitRadius={0}
          orbitSpeed={0}
          label="Libro 3"
        />
        <OrbitingSphere 
          position={[0, 0, -7]} 
          radius={0.5} 
          color="#6495ED"  // Azul cobalto
          orbitRadius={0}
          orbitSpeed={0}
          label="Libro 4"
        />
        <OrbitingSphere 
          position={[5, 2, 5]} 
          radius={0.5} 
          color="#6495ED"  // Azul cobalto
          orbitRadius={0}
          orbitSpeed={0}
          label="Libro 5"
        />
        <OrbitingSphere 
          position={[-5, -1, -5]} 
          radius={0.5} 
          color="#6495ED"  // Azul cobalto
          orbitRadius={0}
          orbitSpeed={0}
          label="Libro 6"
        />
        
        {/* Esferas pequeñas orbitantes - cada una con velocidad y fase única */}
        <OrbitingSphere 
          position={[0, 0.8, 0]} 
          radius={0.3} 
          color="#e11d48" 
          orbitRadius={5.0}
          orbitSpeed={0.12}
          phaseOffset={0}
          label="Esfera 1"
        />
        <OrbitingSphere 
          position={[0, -0.3, 0]} 
          radius={0.3} 
          color="#e11d48" 
          orbitRadius={4.2}
          orbitSpeed={-0.08}
          phaseOffset={Math.PI * 0.4}
          label="Esfera 2"
        />
        <OrbitingSphere 
          position={[0, 0.5, 0]} 
          radius={0.3} 
          color="#e11d48" 
          orbitRadius={6.8}
          orbitSpeed={0.05}
          phaseOffset={Math.PI * 0.8}
          label="Esfera 3"
        />
        <OrbitingSphere 
          position={[0, -0.6, 0]} 
          radius={0.3} 
          color="#e11d48" 
          orbitRadius={7.8}
          orbitSpeed={-0.1}
          phaseOffset={Math.PI * 1.2}
          label="Esfera 4"
        />
        <OrbitingSphere 
          position={[0, 0.2, 0]} 
          radius={0.3} 
          color="#e11d48" 
          orbitRadius={5.5}
          orbitSpeed={0.07}
          phaseOffset={Math.PI * 1.6}
          label="Esfera 5"
        />
      </group>
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        minDistance={SCENE_CONFIG.CAMERA.minDistance}
        maxDistance={SCENE_CONFIG.CAMERA.maxDistance}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

export function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas 
        camera={{ 
          position: SCENE_CONFIG.CAMERA.position as [number, number, number], 
          fov: SCENE_CONFIG.CAMERA.fov 
        }}
      >
        <MainScene />
      </Canvas>
    </div>
  )
}

// Exportar MainScene para uso en SceneManager
export { MainScene }
