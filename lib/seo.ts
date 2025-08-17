import { Metadata } from 'next'
import { Book } from '@/types'

export function generateBookMetadata(book: Book): Metadata {
  const title = book.metaTitle || `${book.title} - AtomoVisión`
  const description = book.metaDescription || book.description_md.slice(0, 160)
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'book',
      images: book.ogImage ? [book.ogImage] : book.coverImage.url ? [book.coverImage.url] : [],
      authors: book.authors,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: book.ogImage ? [book.ogImage] : book.coverImage.url ? [book.coverImage.url] : [],
    },
  }
}

export function generateBookSchema(book: Book) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.authors[0],
    },
    description: book.description_md,
    isbn: book.formats.paperback?.isbn || book.formats.hardcover?.isbn,
    numberOfPages: book.formats.ebook?.pages,
    inLanguage: book.language,
    datePublished: book.releaseDate,
    publisher: {
      '@type': 'Organization',
      name: 'AtomoVisión',
    },
    offers: {
      '@type': 'Offer',
      price: (book.price / 100).toFixed(2),
      priceCurrency: book.currency,
      availability: book.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'AtomoVisión',
      },
    },
    aggregateRating: book.rating ? {
      '@type': 'AggregateRating',
      ratingValue: book.rating,
      bestRating: 5,
    } : undefined,
  }
}
