import { Providers } from './providers'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { BookLoader } from '@/components/BookLoader'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <BookLoader />
      <div className="relative min-h-screen">
        <Header />
        <main className="relative z-10">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
