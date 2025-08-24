import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Colecciones | AtomoVisión',
  description: 'Página en construcción',
}

export default function CollectionsPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          EN CONSTRUCCIÓN
        </h1>
        <p className="text-xl text-muted-foreground">
          Próximamente
        </p>
      </div>
    </div>
  )
}
