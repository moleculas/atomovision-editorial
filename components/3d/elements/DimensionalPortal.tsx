'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useUIStore } from '@/lib/store'

interface DimensionalPortalProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  color: string
  label: string
  destination: string
}

export function DimensionalPortal({
  position,
  rotation = [0, 0, 0],
  color,
  label,
  destination
}: DimensionalPortalProps) {
  const portalRef = useRef<THREE.Group>(null)
  const ringRef1 = useRef<THREE.Mesh>(null)
  const ringRef2 = useRef<THREE.Mesh>(null)
  const vortexRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [activated, setActivated] = useState(false)
  
  // Geometría del vórtice
  const vortexGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(4, 4, 32, 32)
    const positions = geometry.attributes.position
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const distance = Math.sqrt(x * x + y * y)
      positions.setZ(i, Math.sin(distance * 3) * 0.2)
    }
    
    geometry.computeVertexNormals()
    return geometry
  }, [])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Rotar anillos del portal
    if (ringRef1.current) {
      ringRef1.current.rotation.z = time * 0.5
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -time * 0.3
    }
    
    // Animar vórtice
    if (vortexRef.current && vortexRef.current.material) {
      const material = vortexRef.current.material as THREE.ShaderMaterial
      if (material.uniforms) {
        material.uniforms.time.value = time
      }
    }
    
    // Efecto hover
    if (portalRef.current) {
      const scale = hovered ? 1.1 : 1
      portalRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })
  
  const handleClick = () => {
    if (!activated) {
      setActivated(true)
      // Aquí iría la lógica de transición a otra escena
      console.log(`Transitioning to: ${destination}`)
      setTimeout(() => {
        setActivated(false)
        // TODO: Implementar cambio de escena
      }, 2000)
    }
  }
  
  // Shader material para el vórtice
  const vortexMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color) },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 center = vec2(0.5);
          float dist = distance(vUv, center);
          
          // Espiral del portal
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float spiral = sin(angle * 5.0 - time * 2.0 + dist * 10.0);
          
          // Gradiente radial
          float gradient = 1.0 - dist * 2.0;
          gradient = smoothstep(0.0, 1.0, gradient);
          
          // Color final
          vec3 finalColor = color * (1.0 + spiral * 0.5);
          float finalAlpha = gradient * opacity * (0.5 + spiral * 0.5);
          
          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  }, [color])
  
  return (
    <group
      ref={portalRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Anillo exterior */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.5, 0.1, 8, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Anillo interior */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[2, 0.05, 8, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Vórtice del portal */}
      <mesh ref={vortexRef} geometry={vortexGeometry} material={vortexMaterial} />
      
      {/* Partículas emanando */}
      {activated && (
        <mesh>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
      
      {/* Etiqueta del portal */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
        visible={hovered || activated}
      >
        {label}
      </Text>
      
      {/* Luz del portal */}
      <pointLight
        color={color}
        intensity={hovered ? 3 : 1.5}
        distance={10}
        decay={2}
      />
    </group>
  )
}
