import { Grid } from '@react-three/drei'
import { useUIStore } from '@/lib/store'

export function Floor() {
  const performanceMode = useUIStore((state) => state.performanceMode)

  return (
    <>
      {/* Suelo principal - parqué de madera */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#8B6F47" 
          roughness={0.9} 
          metalness={0.0}
        />
      </mesh>

      {/* Grid simple */}
      {performanceMode !== 'low' && (
        <gridHelper args={[50, 50, '#CCCCCC', '#EEEEEE']} position={[0, -0.99, 0]} />
      )}
    </>
  )
}
