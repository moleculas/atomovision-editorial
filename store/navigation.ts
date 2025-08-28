import { create } from 'zustand'
import * as THREE from 'three'

type SceneType = 'home' | 'catalog' | 'genres' | 'book-detail' | 'collection'

interface NavigationState {
  currentScene: SceneType
  previousScene: SceneType | null
  isTransitioning: boolean
  transitionProgress: number
  sharedTexture: THREE.Texture | null
  
  // Actions
  setScene: (scene: SceneType) => void
  startTransition: (to: SceneType, texture?: THREE.Texture) => void
  updateTransitionProgress: (progress: number) => void
  completeTransition: () => void
  setSharedTexture: (texture: THREE.Texture | null) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentScene: 'home',
  previousScene: null,
  isTransitioning: false,
  transitionProgress: 0,
  sharedTexture: null,
  
  setScene: (scene) => set({ currentScene: scene }),
  
  startTransition: (to, texture) => {
    console.log('Starting transition to:', to)
    console.log('Texture passed:', texture)
    set((state) => {
      console.log('Previous sharedTexture:', state.sharedTexture)
      console.log('Setting new texture:', texture || state.sharedTexture)
      return {
        previousScene: state.currentScene,
        isTransitioning: true,
        transitionProgress: 0.2, // Empezar con 20% para que sea visible
        sharedTexture: texture || state.sharedTexture,
      }
    })
    
    // Transición RÁPIDA
    let progress = 0.2
    const duration = 800 // Solo 0.8 segundos
    const steps = 20
    const stepDuration = duration / steps
    const increment = (1 - 0.2) / steps
    
    const interval = setInterval(() => {
      progress += increment
      if (progress >= 1) {
        progress = 1
        clearInterval(interval)
        
        // Primero cambiamos la escena (mientras aún está negro)
        set({ currentScene: to })
        
        // Luego esperamos un poco antes de quitar el overlay
        setTimeout(() => {
          set({
            isTransitioning: false,
            transitionProgress: 0,
          })
        }, 300) // Aumentado delay para asegurar que no hay destello
      }
      
      set({ transitionProgress: progress })
    }, stepDuration)
  },
  
  updateTransitionProgress: (progress) => set({ transitionProgress: progress }),
  
  completeTransition: () => {
    console.log('Completing transition')
    set((state) => ({
      currentScene: 'catalog',
      isTransitioning: false,
      transitionProgress: 1,
    }))
  },
  
  setSharedTexture: (texture) => set({ sharedTexture: texture }),
}))

// Función de easing para transición más suave
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}
