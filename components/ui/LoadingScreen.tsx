export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg font-playfair">Cargando experiencia 3D...</p>
        <p className="text-sm text-muted-foreground mt-2">Preparando el espacio editorial</p>
      </div>
    </div>
  )
}
