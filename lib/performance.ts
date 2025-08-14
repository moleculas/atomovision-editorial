import { getGPUTier } from 'detect-gpu'

export interface GPUTierResult {
  tier: number
  type: 'BENCHMARK' | 'WEBGL_FALLBACK' | 'OVERRIDE'
  isMobile: boolean
  gpu?: string
}

let cachedGPUTier: GPUTierResult | null = null

export async function detectGPU(): Promise<GPUTierResult> {
  if (cachedGPUTier) return cachedGPUTier
  
  try {
    const gpuTier = await getGPUTier()
    cachedGPUTier = gpuTier
    return gpuTier
  } catch (error) {
    console.error('Error detecting GPU:', error)
    // Fallback para cuando falla la detección
    return {
      tier: 1,
      type: 'WEBGL_FALLBACK',
      isMobile: false,
    }
  }
}

export function getPerformancePreset(gpuTier: GPUTierResult) {
  const { tier, isMobile } = gpuTier
  
  if (tier >= 3 && !isMobile) {
    return {
      mode: 'high',
      shadows: true,
      postprocessing: true,
      antialias: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      maxLights: 8,
      textureResolution: 2048,
      particleCount: 1000,
    }
  } else if (tier >= 2) {
    return {
      mode: 'medium',
      shadows: true,
      postprocessing: false,
      antialias: true,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      maxLights: 4,
      textureResolution: 1024,
      particleCount: 500,
    }
  } else {
    return {
      mode: 'low',
      shadows: false,
      postprocessing: false,
      antialias: false,
      pixelRatio: 1,
      maxLights: 2,
      textureResolution: 512,
      particleCount: 100,
    }
  }
}

// Utilidad para cargar assets optimizados según el rendimiento
export function getAssetUrl(baseUrl: string, performanceMode: string): string {
  const suffix = performanceMode === 'low' ? '-low' : performanceMode === 'medium' ? '-med' : ''
  const extension = baseUrl.substring(baseUrl.lastIndexOf('.'))
  const name = baseUrl.substring(0, baseUrl.lastIndexOf('.'))
  
  return `${name}${suffix}${extension}`
}

// Hook para detectar soporte WebGL
export function hasWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true // SSR
  
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

// Detector de reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Optimizador de texturas
export function getOptimizedTextureSettings(performanceMode: string) {
  switch (performanceMode) {
    case 'low':
      return {
        anisotropy: 1,
        minFilter: 'LinearFilter',
        magFilter: 'LinearFilter',
        generateMipmaps: false,
      }
    case 'medium':
      return {
        anisotropy: 4,
        minFilter: 'LinearMipmapLinearFilter',
        magFilter: 'LinearFilter',
        generateMipmaps: true,
      }
    default:
      return {
        anisotropy: 16,
        minFilter: 'LinearMipmapLinearFilter',
        magFilter: 'LinearFilter',
        generateMipmaps: true,
      }
  }
}
