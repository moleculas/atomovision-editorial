'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import { useUIStore } from '@/lib/store'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Fallback2D } from '@/components/ui/Fallback2D'

// Carga dinámica del componente 3D
const SceneManager = dynamic(() => import('@/components/3d/SceneManager').then(mod => ({ default: mod.SceneManager })), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

export default function HomePage() {
  // Siempre mostrar modo 2D por defecto
  return <Fallback2D />
}
