import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getBookBySlug, getBooks } from '@/lib/cms'
import { generateBookMetadata, generateBookSchema } from '@/lib/seo'
import { BookDetail } from '@/components/ui/BookDetail'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const books = await getBooks()
  return books.map((book) => ({
    slug: book.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBookBySlug(params.slug)
  if (!book) return {}
  
  return generateBookMetadata(book)
}

export default async function BookPage({ params }: Props) {
  const book = await getBookBySlug(params.slug)

  if (!book) {
    notFound()
  }

  const bookSchema = generateBookSchema(book)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />
      <BookDetail book={book} />
    </>
  )
}
