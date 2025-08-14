'use client'

import { useEffect, useState } from 'react'
import { detectGPU, hasWebGLSupport, prefersReducedMotion } from '@/lib/performance'
import { useUIStore } from '@/lib/store'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { setViewMode, setPerformanceMode } = useUIStore()

  useEffect(() => {
    setMounted(true)

    // Detectar capacidades del dispositivo
    const initializePerformance = async () => {
      // Verificar soporte WebGL
      if (!hasWebGLSupport()) {
        setViewMode('2d')
        return
      }

      // Detectar GPU
      const gpuInfo = await detectGPU()
      
      // Establecer modo de rendimiento según GPU
      if (gpuInfo.tier >= 3) {
        setPerformanceMode('high')
      } else if (gpuInfo.tier >= 2) {
        setPerformanceMode('medium')
      } else {
        setPerformanceMode('low')
      }

      // Respetar preferencia de reduced motion
      if (prefersReducedMotion()) {
        setPerformanceMode('low')
      }
    }

    initializePerformance()
  }, [setViewMode, setPerformanceMode])

  if (!mounted) {
    return null
  }

  return <>{children}</>
}
