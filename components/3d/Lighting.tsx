import { useUIStore } from '@/lib/store'

interface LightingProps {
  performanceMode: string
}

export function Lighting({ performanceMode }: LightingProps) {
  return (
    <>
      {/* Luz ambiental cálida */}
      <ambientLight intensity={performanceMode === 'low' ? 0.5 : 0.3} color="#FFF5E6" />

      {/* Luz direccional principal - simula luz natural desde ventanas */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={performanceMode === 'low' ? 0.7 : 0.9}
        color="#FFF8DC"
        castShadow={performanceMode !== 'low'}
        shadow-mapSize={performanceMode === 'high' ? [2048, 2048] : [1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />

      {/* Luces cálidas de lectura */}
      {performanceMode !== 'low' && (
        <>
          <pointLight position={[-5, 3, -3]} intensity={0.4} color="#FFDAB9" distance={8} />
          <pointLight position={[5, 3, -3]} intensity={0.4} color="#FFDAB9" distance={8} />
          <pointLight position={[0, 3, -8]} intensity={0.5} color="#FFE4B5" distance={10} />
          <pointLight position={[0, 2.5, 0]} intensity={0.6} color="#FFF8DC" distance={6} />
        </>
      )}

      {/* Luz de relleno suave */}
      {performanceMode === 'high' && (
        <hemisphereLight
          intensity={0.25}
          color="#FFF5E6"
          groundColor="#D2B48C"
        />
      )}
    </>
  )
}
