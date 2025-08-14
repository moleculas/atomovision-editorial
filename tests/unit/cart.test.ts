import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '@/lib/store'
import { mockBooks } from '@/lib/cms'

describe('Cart Store', () => {
  beforeEach(() => {
    // Limpiar el store antes de cada test
    useCartStore.setState({ items: [] })
  })

  test('añadir item al carrito', () => {
    const { result } = renderHook(() => useCartStore())
    const book = mockBooks[0]

    act(() => {
      result.current.addItem(book, 'ebook')
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].bookId).toBe(book.id)
    expect(result.current.items[0].format).toBe('ebook')
    expect(result.current.items[0].quantity).toBe(1)
  })

  test('incrementar cantidad de item existente', () => {
    const { result } = renderHook(() => useCartStore())
    const book = mockBooks[0]

    act(() => {
      result.current.addItem(book, 'ebook')
      result.current.addItem(book, 'ebook', 2)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(3)
  })

  test('eliminar item del carrito', () => {
    const { result } = renderHook(() => useCartStore())
    const book = mockBooks[0]

    act(() => {
      result.current.addItem(book, 'ebook')
      result.current.removeItem(book.id, 'ebook')
    })

    expect(result.current.items).toHaveLength(0)
  })

  test('actualizar cantidad', () => {
    const { result } = renderHook(() => useCartStore())
    const book = mockBooks[0]

    act(() => {
      result.current.addItem(book, 'ebook')
      result.current.updateQuantity(book.id, 'ebook', 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
  })

  test('calcular total de items', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addItem(mockBooks[0], 'ebook', 2)
      result.current.addItem(mockBooks[1], 'paperback', 3)
    })

    expect(result.current.getTotalItems()).toBe(5)
  })

  test('calcular precio total', () => {
    const { result } = renderHook(() => useCartStore())
    const book = mockBooks[0]

    act(() => {
      result.current.addItem(book, 'ebook', 2)
    })

    expect(result.current.getTotalPrice()).toBe(book.price * 2)
  })

  test('limpiar carrito', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addItem(mockBooks[0], 'ebook')
      result.current.addItem(mockBooks[1], 'paperback')
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
  })
})
