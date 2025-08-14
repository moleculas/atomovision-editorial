import { Metadata } from 'next'
import { Book } from '@/types'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'book'
}

const defaultSEO: SEOProps = {
  title: 'AtomoVisión - Libros digitales y físicos',
  description: 'Descubre nuestra colección de libros en una experiencia 3D inmersiva. E-books y libros físicos de literatura, ensayo y más.',
  image: '/og-image.jpg',
  type: 'website',
}

export function generateMetadata(props: SEOProps = {}): Metadata {
  const { title, description, image, url, type } = { ...defaultSEO, ...props }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://editorial3d.com'
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `${siteUrl}${image}` }],
      url: url ? `${siteUrl}${url}` : siteUrl,
      type: type as any,
      siteName: 'AtomoVisión',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}${image}`],
    },
    alternates: {
      canonical: url ? `${siteUrl}${url}` : siteUrl,
    },
  }
}

export function generateBookMetadata(book: Book): Metadata {
  return generateMetadata({
    title: book.metaTitle || `${book.title} - ${book.authors.join(', ')}`,
    description: book.metaDescription || book.description_md.slice(0, 160),
    image: book.ogImage || book.coverImage.url,
    url: `/book/${book.slug}`,
    type: 'book',
  })
}

export function generateBookSchema(book: Book) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://editorial3d.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: book.authors.map(author => ({
      '@type': 'Person',
      name: author,
    })),
    description: book.description_md,
    isbn: book.formats.paperback?.isbn || book.formats.hardcover?.isbn,
    numberOfPages: book.formats.ebook?.pages,
    inLanguage: book.language,
    datePublished: book.releaseDate,
    image: `${siteUrl}${book.coverImage.url}`,
    offers: {
      '@type': 'Offer',
      price: (book.price / 100).toFixed(2),
      priceCurrency: book.currency,
      availability: book.inventory && book.inventory > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/book/${book.slug}`,
    },
    aggregateRating: book.rating ? {
      '@type': 'AggregateRating',
      ratingValue: book.rating,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://editorial3d.com'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }
}
