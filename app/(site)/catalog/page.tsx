'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useUIStore } from '@/lib/store'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { CatalogView2D } from '@/components/ui/CatalogView2D'

const CatalogView3D = dynamic(() => import('@/components/3d/CatalogView3D').then(mod => mod.CatalogView3D), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

export default function CatalogPage() {
  // Siempre mostrar modo 2D
  return (
    <div className="min-h-screen">
      <CatalogView2D />
    </div>
  )
}
