'use client'

import { useEffect } from 'react'
import { useBookStore } from '@/lib/store'
import { getBooks } from '@/lib/cms'

export function BookLoader() {
  const setBooks = useBookStore((state) => state.setBooks)
  
  useEffect(() => {
    async function loadBooks() {
      const books = await getBooks()
      setBooks(books)
    }
    loadBooks()
  }, [setBooks])
  
  return null
}
