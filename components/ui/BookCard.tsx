import Link from 'next/link'
import { Book } from '@/types'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Eye, Star } from 'lucide-react'

interface BookCardProps {
  book: Book
  viewMode?: 'grid' | 'list'
}

export function BookCard({ book, viewMode = 'grid' }: BookCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg p-4 shadow flex gap-4">
        {/* Book Cover */}
        <Link href={`/libro/${book.slug}`} className="flex-shrink-0">
          <div className="w-24 h-36 bg-accent rounded overflow-hidden">
            {book.coverImage?.url ? (
              <img 
                src={book.coverImage.url} 
                alt={book.coverImage.alt || `Portada de ${book.title}`}
                className="w-full h-full object-cover" style={{objectPosition: '95% center'}}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-xs font-playfair text-center px-1">{book.title}</p>
              </div>
            )}
          </div>
        </Link>

        {/* Book Info */}
        <div className="flex-1">
          <Link href={`/libro/${book.slug}`}>
            <h3 className="font-semibold hover:text-primary transition-colors">{book.title}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-2">{book.authors.join(', ')}</p>
          
          <p className="text-sm mb-3 line-clamp-2">{book.description_md}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">
                {(book.price / 100).toFixed(2)} {book.currency}
              </span>
              {book.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{book.rating}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Link
                href={`/libro/${book.slug}`}
                className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                aria-label="Ver detalles"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  const format = book.formats.ebook ? 'ebook' : 'paperback'
                  addItem(book, format)
                }}
                className="p-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
                aria-label="Añadir al carrito"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="book-card bg-card rounded-lg overflow-hidden shadow-lg">
      {/* Book Cover */}
      <Link href={`/libro/${book.slug}`} className="block relative aspect-[2/3] bg-accent overflow-hidden">
        {book.coverImage?.url ? (
          <img 
            src={book.coverImage.url} 
            alt={book.coverImage.alt || `Portada de ${book.title}`}
            className="w-full h-full object-cover" style={{objectPosition: '75% center'}}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-4">
              <h3 className="font-playfair text-lg mb-2">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.authors.join(', ')}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-white text-sm">Ver detalles</span>
        </div>
        {book.featured && (
          <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
            Destacado
          </span>
        )}
      </Link>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-semibold mb-1 line-clamp-1 text-lg">{book.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{book.authors.join(', ')}</p>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{(Math.random() * 2 + 3).toFixed(1)}</span>
        </div>
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            {(book.price / 100).toFixed(2)} {book.currency}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/libro/${book.slug}`}
              className="p-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              aria-label="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                const format = book.formats.ebook ? 'ebook' : 'paperback'
                addItem(book, format)
              }}
              className="p-2 bg-primary text-white hover:bg-primary/90 rounded-lg transition-colors"
              aria-label="Añadir al carrito"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formats */}
        <div className="flex gap-2 mt-3">
          {book.formats.ebook && (
            <span className="text-xs bg-accent px-2 py-1 rounded">eBook</span>
          )}
          {book.formats.paperback && (
            <span className="text-xs bg-accent px-2 py-1 rounded">Tapa blanda</span>
          )}
          {book.formats.hardcover && (
            <span className="text-xs bg-accent px-2 py-1 rounded">Tapa dura</span>
          )}
        </div>
      </div>
    </div>
  )
}
