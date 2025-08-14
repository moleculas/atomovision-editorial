import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Book, CartItem, ViewMode, PerformanceMode, Language } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (book: Book, format: keyof Book['formats'], quantity?: number) => void
  removeItem: (bookId: string, format: string) => void
  updateQuantity: (bookId: string, format: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

interface UIStore {
  viewMode: ViewMode
  performanceMode: PerformanceMode
  language: Language
  isCartOpen: boolean
  isSearchOpen: boolean
  setViewMode: (mode: ViewMode) => void
  setPerformanceMode: (mode: PerformanceMode) => void
  setLanguage: (lang: Language) => void
  toggleCart: () => void
  toggleSearch: () => void
}

interface SceneStore {
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  selectedHotspot: string | null
  setCameraPosition: (position: [number, number, number]) => void
  setCameraTarget: (target: [number, number, number]) => void
  setSelectedHotspot: (id: string | null) => void
}

interface BookStore {
  books: Book[]
  setBooks: (books: Book[]) => void
}

// Cart Store con persistencia
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (book, format, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.bookId === book.id && item.format === format
          )
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.bookId === book.id && item.format === format
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          
          const formatData = book.formats[format]
          if (!formatData) return state
          
          return {
            items: [
              ...state.items,
              {
                bookId: book.id,
                format,
                quantity,
                price: book.price,
              },
            ],
          }
        })
      },
      
      removeItem: (bookId, format) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.bookId === bookId && item.format === format)
          ),
        }))
      },
      
      updateQuantity: (bookId, format, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId, format)
          return
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.bookId === bookId && item.format === format
              ? { ...item, quantity }
              : item
          ),
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'editorial-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// UI Store con persistencia parcial
export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      viewMode: '3d',
      performanceMode: 'medium',
      language: 'es',
      isCartOpen: false,
      isSearchOpen: false,
      
      setViewMode: (mode) => set({ viewMode: mode }),
      setPerformanceMode: (mode) => set({ performanceMode: mode }),
      setLanguage: (lang) => set({ language: lang }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    }),
    {
      name: 'editorial-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        performanceMode: state.performanceMode,
        language: state.language,
      }),
    }
  )
)

// Scene Store (sin persistencia)
export const useSceneStore = create<SceneStore>((set) => ({
  cameraPosition: [0, 5, 10],
  cameraTarget: [0, 0, 0],
  selectedHotspot: null,
  
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setSelectedHotspot: (id) => set({ selectedHotspot: id }),
}))

// Book Store (sin persistencia)
export const useBookStore = create<BookStore>((set) => ({
  books: [],
  setBooks: (books) => set({ books }),
}))
