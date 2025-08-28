'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useThree, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { useNavigationStore } from '@/store/navigation'

// ========== CONFIGURACIÓN DEL ORÁCULO ==========
// Cambia estos valores para usar diferentes modelos de oráculo
const ORACLE_TYPE: 'ply' | 'gltf' | 'obj' = 'ply' // Tipo de modelo: 'ply', 'gltf', 'obj'
const ORACLE_MODEL = 'Jaguar ring.ply' // Nombre del archivo (con extensión)
// angel
//const ORACLE_SCALE = 0.0024 // Ajusta el tamaño del modelo si es necesario
//const ORACLE_POSITION: [number, number, number] = [0, 0.5, 0] // Posición [x, y, z]
//const ORACLE_ROTATION: [number, number, number] = [0, -Math.PI / 2, 0] // Rotación [x, y, z]
// anell
const ORACLE_SCALE = 0.1
const ORACLE_POSITION: [number, number, number] = [0, 0.5, 0] // Posición [x, y, z]
//const ORACLE_ROTATION: [number, number, number] = [4, -Math.PI / 2, 0] // Rotación [x, y, z]
const ORACLE_ROTATION: [number, number, number] = [1.558, 3.375, 0.831] // Rotación [x, y, z]

// CONTROLES DE DESARROLLO
const SHOW_DEV_CONTROLS = false // Cambiar a false para ocultar los controles en producción

// ===============================================

// Componente SpotLight con helper opcional
function SpotLightWithHelper() {
  const lightRef = useRef<THREE.SpotLight>(null)
  const targetRef = useRef<THREE.Object3D>(null)
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null)
  
  // Cargar textura
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load('/textures/disturb.jpg', (loadedTexture) => {
      loadedTexture.minFilter = THREE.LinearFilter
      loadedTexture.magFilter = THREE.LinearFilter
      loadedTexture.generateMipmaps = false
      loadedTexture.colorSpace = THREE.SRGBColorSpace
      setTexture(loadedTexture)
    })
  }, [])
  
  // Animar la posición del spotlight
  useFrame(({ clock }) => {
    if (lightRef.current && targetRef.current) {
      const time = clock.getElapsedTime() / 3
      lightRef.current.position.x = Math.cos(time) * 2.5
      lightRef.current.position.z = Math.sin(time) * 2.5
      // El target siempre mira al modelo
      lightRef.current.target = targetRef.current
    }
  })
  
  return (
    <>
      <spotLight
        ref={lightRef}
        position={[2.5, 5, 2.5]}
        angle={Math.PI / 6}
        penumbra={1}
        decay={2}
        distance={0}
        intensity={100}
        castShadow
        map={texture}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-focus={1}
        color="#ffffff"
      />
      {/* Target invisible para el spotlight */}
      <object3D ref={targetRef} position={[0, 0.5, 0]} />
    </>
  )
}

// Componentes separados para cada tipo de modelo para evitar llamadas condicionales de hooks
function PLYModel({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const plyGeometry = useLoader(PLYLoader, `/models/ply/${ORACLE_MODEL}`)
  
  useEffect(() => {
    if (plyGeometry) {
      plyGeometry.scale(ORACLE_SCALE, ORACLE_SCALE, ORACLE_SCALE)
      plyGeometry.computeVertexNormals()
    }
  }, [plyGeometry])
  
  return (
    <mesh 
      geometry={plyGeometry}
      rotation={rotation}
      position={position}
      castShadow
      receiveShadow
    >
      <meshLambertMaterial color="#ffffff" />
    </mesh>
  )
}

function GLTFModel({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(`/models/gltf/${ORACLE_MODEL}`)
  
  useEffect(() => {
    if (scene && groupRef.current) {
      // Limpiar el grupo
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0])
      }
      
      // Clonar y agregar el modelo
      const model = scene.clone()
      
      // Aplicar sombras a todos los meshes
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      
      groupRef.current.add(model)
    }
  }, [scene])
  
  return (
    <group
      ref={groupRef}
      rotation={rotation}
      position={position}
      scale={[ORACLE_SCALE, ORACLE_SCALE, ORACLE_SCALE]}
    />
  )
}

function OBJModel({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const obj = useLoader(OBJLoader, `/models/obj/${ORACLE_MODEL}`)
  
  useEffect(() => {
    if (obj && groupRef.current) {
      // Limpiar el grupo
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0])
      }
      
      // Clonar y agregar el modelo
      const model = obj.clone()
      
      // Aplicar material blanco y sombras a todos los meshes
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material = new THREE.MeshLambertMaterial({ color: '#ffffff' })
        }
      })
      
      groupRef.current.add(model)
    }
  }, [obj])
  
  return (
    <group
      ref={groupRef}
      rotation={rotation}
      position={position}
      scale={[ORACLE_SCALE, ORACLE_SCALE, ORACLE_SCALE]}
    />
  )
}

// Componente para el modelo del Oráculo
function OracleModel({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  // Renderizar el componente apropiado según el tipo
  if (ORACLE_TYPE === 'ply') {
    return <PLYModel position={position} rotation={rotation} />
  }
  
  if (ORACLE_TYPE === 'gltf') {
    return <GLTFModel position={position} rotation={rotation} />
  }
  
  if (ORACLE_TYPE === 'obj') {
    return <OBJModel position={position} rotation={rotation} />
  }
  
  // Fallback
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1.6, 1]} />
      <meshBasicMaterial color="gray" />
    </mesh>
  )
}

// Componente de controles de desarrollo
function DevControls({ onRotationChange }: { 
  onRotationChange: (axis: 'x' | 'y' | 'z', value: number) => void 
}) {
  const [rotationX, setRotationX] = useState(ORACLE_ROTATION[0])
  const [rotationY, setRotationY] = useState(ORACLE_ROTATION[1])
  const [rotationZ, setRotationZ] = useState(ORACLE_ROTATION[2])
  
  const handleRotationXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setRotationX(value)
    onRotationChange('x', value)
  }
  
  const handleRotationYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setRotationY(value)
    onRotationChange('y', value)
  }
  
  const handleRotationZChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setRotationZ(value)
    onRotationChange('z', value)
  }
  
  if (!SHOW_DEV_CONTROLS) return null
  
  return (
    <Html fullscreen>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px',
        minWidth: '300px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        pointerEvents: 'auto',
        zIndex: 1000
      }}>
        <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '10px', color: '#00ff00' }}>DEV CONTROLS</div>
        <div style={{ marginBottom: '15px', marginTop: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#00ff00' }}>ORACLE ROTATION X: {rotationX.toFixed(3)}</label>
          <input
            type="range"
            min="0"
            max="6.283"
            step="0.001"
            value={rotationX}
            onChange={handleRotationXChange}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', opacity: 0.5 }}>
            <span>0°</span>
            <span>180°</span>
            <span>360°</span>
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#00ff00' }}>ORACLE ROTATION Y: {rotationY.toFixed(3)}</label>
          <input
            type="range"
            min="0"
            max="6.283"
            step="0.001"
            value={rotationY}
            onChange={handleRotationYChange}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', opacity: 0.5 }}>
            <span>0°</span>
            <span>180°</span>
            <span>360°</span>
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#00ff00' }}>ORACLE ROTATION Z: {rotationZ.toFixed(3)}</label>
          <input
            type="range"
            min="0"
            max="6.283"
            step="0.001"
            value={rotationZ}
            onChange={handleRotationZChange}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', opacity: 0.5 }}>
            <span>0°</span>
            <span>180°</span>
            <span>360°</span>
          </div>
        </div>
        
        <div style={{ marginTop: '15px', fontSize: '10px', opacity: 0.6 }}>
          <div>Copiar valores:</div>
          <div style={{ color: '#ffcc00', marginTop: '5px' }}>const ORACLE_ROTATION = [{rotationX.toFixed(3)}, {rotationY.toFixed(3)}, {rotationZ.toFixed(3)}]</div>
        </div>
      </div>
    </Html>
  )
}

export function CatalogScene() {
  const { gl, scene, camera } = useThree()
  const currentScene = useNavigationStore((state) => state.currentScene)
  
  // Estados para los valores dinámicos
  const [oracleRotation, setOracleRotation] = useState<[number, number, number]>(ORACLE_ROTATION)
  
  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (axis === 'x') {
      setOracleRotation([value, oracleRotation[1], oracleRotation[2]])
    } else if (axis === 'y') {
      setOracleRotation([oracleRotation[0], value, oracleRotation[2]])
    } else {
      setOracleRotation([oracleRotation[0], oracleRotation[1], value])
    }
  }
  
  useEffect(() => {
    // Solo configurar el renderer si esta escena está activa
    if (currentScene === 'catalog') {
      // Configurar sombras
      gl.shadowMap.enabled = true
      gl.shadowMap.type = THREE.PCFSoftShadowMap
      
      // Configurar tone mapping
      gl.toneMapping = THREE.ACESFilmicToneMapping
      gl.toneMappingExposure = 1
      
      // Configurar color de fondo negro
      gl.setClearColor(0x000000, 1)
      
      // Agregar niebla para hacer visible el haz de luz
      scene.fog = new THREE.Fog(0x000000, 1, 15)
      
      // Ajustar la cámara más cerca
      camera.position.set(3, 2, 3)
      camera.lookAt(0, 0.5, 0)
      
      return () => {
        // Limpiar la niebla al salir de la escena
        scene.fog = null
      }
    }
  }, [gl, scene, camera, currentScene])
  
  return (
    <>
      {/* Iluminación ambiental */}
      <hemisphereLight 
        color={0xffffff} 
        groundColor={0x444444} 
        intensity={0.15} 
      />
      
      {/* SpotLight animado */}
      <SpotLightWithHelper />
      
      {/* Plano del suelo */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshLambertMaterial color={0xbcbcbc} />
      </mesh>
      
      {/* Modelo del Oráculo */}
      <React.Suspense fallback={
        <mesh position={ORACLE_POSITION}>
          <boxGeometry args={[1, 1.6, 1]} />
          <meshBasicMaterial color="gray" />
        </mesh>
      }>
        <OracleModel position={ORACLE_POSITION} rotation={oracleRotation} />
      </React.Suspense>
      
      {/* Haces de luz volumétricos */}
      <VolumetricSpotlight />
      
      {/* Controles de órbita */}
      <OrbitControls 
        minDistance={2}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2}
        target={ORACLE_POSITION}
        enablePan={false}
      />
      
      {/* Controles de desarrollo */}
      <DevControls 
        onRotationChange={handleRotationChange}
      />
      
    </>
  )
}

// Componente para crear haces de luz volumétricos
function VolumetricSpotlight() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime() / 3
      meshRef.current.position.x = Math.cos(time) * 2.5
      meshRef.current.position.z = Math.sin(time) * 2.5
      // Hacer que el cono siempre apunte hacia abajo
      meshRef.current.lookAt(meshRef.current.position.x, -10, meshRef.current.position.z)
    }
  })
  
  return (
    <mesh ref={meshRef} position={[2.5, 5, 2.5]}>
      <coneGeometry args={[2.5, 6, 32, 1, true]} />
      <meshBasicMaterial 
        color="#ffffff"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
