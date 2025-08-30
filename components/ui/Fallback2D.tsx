'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBooks } from '@/lib/cms'
import { Book } from '@/types'
import { useCartStore } from '@/lib/store'
import { ShoppingCart, Eye, Star, ChevronLeft, ChevronRight, BookOpen, Sparkles, Info, Send, Settings } from 'lucide-react'
import { bookService } from '@/lib/services/book.service'

export function Fallback2D() {
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null)
  const [newBooks, setNewBooks] = useState<Book[]>([])
  const [bestSellers, setBestSellers] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { addItem, hasItem } = useCartStore()
  
  // Estados para el rating del libro destacado
  const [userRating, setUserRating] = useState<number | null>(null)
  const [hasRated, setHasRated] = useState(false)
  const [currentRating, setCurrentRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [isRating, setIsRating] = useState(false)
  
  // Estados para la configuración de la home
  const [homeSettings, setHomeSettings] = useState({
    headerTitle: 'AtomoVisión',
    headerDescription: 'AtomoVisión es una editorial digital que utiliza inteligencia artificial para crear libros únicos de ciencia ficción y fantasía. Cada obra es una experiencia literaria original que explora nuevos mundos e historias.',
    chatQuestions: {
      question1: '¿Cuáles son los secretos mejor guardados de este mundo?',
      question2: '¿Qué fuerzas o poderes mueven este universo?',
      question3: '¿Cómo era este mundo antes de que comenzara la historia?',
      question4: 'Ponte en la piel del protagonista'
    }
  })
  
  // Estados para el chat
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([{
    role: 'assistant',
    content: 'Bienvenido a este universo literario. Soy el narrador de esta historia y puedo guiarte por todos sus rincones. ¿Qué te gustaría descubrir?'
  }])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [chatEnabled, setChatEnabled] = useState(false)
  
  // Ref para el contenedor de mensajes del chat
  const chatMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [])
  
  // Efecto para hacer scroll al último mensaje
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [chatMessages])
  
  // Verificar si el libro tiene chat habilitado
  useEffect(() => {
    if (featuredBook && (featuredBook as any)._id) {
      // Verificar si el libro tiene configuración N8N
      const hasWebhook = !!(featuredBook as any).n8nConfig?.webhookUrl
      setChatEnabled(hasWebhook)
    }
  }, [featuredBook])
  
  const loadData = async () => {
    try {
      setLoading(true)
      
      let loadedFeaturedBook = null
      
      // Cargar configuración de la home
      console.log('[FALLBACK2D] Cargando configuración de home...')
      console.log('[FALLBACK2D] Timestamp:', new Date().toISOString())
      
      // IMPORTANTE: Forzar recarga sin caché añadiendo timestamp único
      const timestamp = Date.now()
      const settingsUrl = `/api/public/home-settings?t=${timestamp}&_=${Math.random()}`
      console.log('[FALLBACK2D] URL con cache buster:', settingsUrl)
      
      const settingsRes = await fetch(settingsUrl, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      console.log('[FALLBACK2D] Response status:', settingsRes.status)
      console.log('[FALLBACK2D] Response headers:', Object.fromEntries(settingsRes.headers.entries()))
      
      if (settingsRes.ok) {
        const responseText = await settingsRes.text()
        console.log('[FALLBACK2D] Response length:', responseText.length)
        const { settings } = JSON.parse(responseText)
        console.log('[FALLBACK2D] Settings recibidos:', settings)
        console.log('[FALLBACK2D] Featured book:', settings?.featuredBookId)
        console.log('[FALLBACK2D] Header title:', settings?.headerTitle)
        
        if (settings) {
          setHomeSettings({
            headerTitle: settings.headerTitle || 'AtomoVisión',
            headerDescription: settings.headerDescription || homeSettings.headerDescription,
            chatQuestions: settings.chatQuestions || homeSettings.chatQuestions
          })
          
          // Si hay un libro destacado configurado, usarlo
          if (settings.featuredBookId) {
            console.log('[FALLBACK2D] Estableciendo libro destacado:', settings.featuredBookId.title)
            loadedFeaturedBook = settings.featuredBookId
            setFeaturedBook(settings.featuredBookId)
            setCurrentRating(settings.featuredBookId.rating || 0)
            setTotalRatings(settings.featuredBookId.totalRatings || 0)
          } else {
            console.log('[FALLBACK2D] No hay libro destacado en settings')
          }
        }
      } else {
        console.error('[FALLBACK2D] Error al cargar settings:', settingsRes.status)
      }
      
      // Cargar todos los libros
      const allBooks = await getBooks()
      
      // Si no hay libro destacado configurado en HomeSettings, usar el primero marcado como featured
      if (!loadedFeaturedBook) {
        const featured = allBooks.find(book => book.featured) || allBooks[0]
        setFeaturedBook(featured)
        
        if (featured) {
          setCurrentRating(featured.rating || 0)
          setTotalRatings(featured.totalRatings || 0)
        }
      }
      
      // Novedades (los últimos 8 libros)
      setNewBooks(allBooks.slice(0, 8))
      
      // Más vendidos (los primeros 10 por ahora)
      // En producción esto vendría de un campo de ventas real
      setBestSellers(allBooks.slice(0, 10))
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Verificar si el usuario ya ha votado el libro destacado
  useEffect(() => {
    async function checkRating() {
      if (!featuredBook) return
      
      try {
        const result = await bookService.checkUserRating(featuredBook.id)
        if (result.hasRated && result.userRating) {
          setHasRated(true)
          setUserRating(result.userRating)
        }
      } catch (error) {
        console.error('Error al verificar voto:', error)
      }
    }
    checkRating()
  }, [featuredBook])

  const handleRating = async (rating: number) => {
    if (!featuredBook || hasRated || isRating) return
    
    setIsRating(true)
    
    try {
      const result = await bookService.rateBook(featuredBook.id, rating)
      
      setUserRating(rating)
      setHasRated(true)
      setCurrentRating(result.rating)
      setTotalRatings(result.totalRatings)
    } catch (error) {
      console.error('Error al votar:', error)
      alert('Error al registrar tu voto. Por favor intenta de nuevo.')
    } finally {
      setIsRating(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(newBooks.length / 4))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(newBooks.length / 4)) % Math.ceil(newBooks.length / 4))
  }
  
  // Funciones del chat
  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || chatInput.trim()
    if (!messageToSend || isChatLoading || !featuredBook || !chatEnabled) return
    
    // Añadir mensaje del usuario
    setChatMessages(prev => [...prev, { role: 'user', content: messageToSend }])
    setChatInput('')
    setIsChatLoading(true)
    
    try {
      const response = await fetch('/api/chat/n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: (featuredBook as any)._id || featuredBook.id,
          message: messageToSend
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.data.response 
        }])
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Lo siento, no pude procesar tu pregunta. Por favor, intenta de nuevo más tarde.' 
        }])
      }
    } catch (error) {
      console.error('Error en chat:', error)
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Ups, parece que hay un problema de conexión. Por favor, intenta de nuevo.' 
      }])
    } finally {
      setIsChatLoading(false)
    }
  }
  
  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4">Cargando editorial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header Editorial */}
      <section className="pt-28 pb-1 bg-white">
        <div className="container mx-auto px-4">
          <div>
            <h1 className="text-5xl lg:text-7xl font-playfair font-bold mb-4">{homeSettings.headerTitle}</h1>
            <p className="text-lg text-gray-600 mb-6">
              {homeSettings.headerDescription}
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <BookOpen className="w-5 h-5" />
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>

      {/* Hero Section - Habla con el Libro */}
      {featuredBook && (
        <section className="pt-20 pb-12 bg-white border-b-2 border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Portada del libro */}
              <div className="lg:col-span-4">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg w-full">
                  {featuredBook.coverImage?.url ? (
                    <Image 
                      src={featuredBook.coverImage.url} 
                      alt={featuredBook.coverImage.alt || `Portada de ${featuredBook.title}`}
                      width={400}
                      height={600}
                      className="w-full h-full object-cover rounded-lg shadow-xl"
                      style={{objectPosition: '75% center'}}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-accent flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Con IA
                  </div>
                </div>
              </div>

              {/* Información del libro */}
              <div className="lg:col-span-4">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Libro destacado</span>
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">Novedad</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-playfair mb-3">{featuredBook.title}</h2>
                  <p className="text-lg text-muted-foreground mb-2">Por {featuredBook.authors?.map(a => typeof a === 'string' ? a : (a as any).name).join(', ')}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleRating(i + 1)}
                          disabled={hasRated || isRating}
                          className={`${hasRated || isRating ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              i < Math.floor(currentRating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : i < Math.floor(userRating || 0)
                                ? 'fill-amber-300 text-amber-300'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm ml-1">({currentRating.toFixed(1)})</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {totalRatings} {totalRatings === 1 ? 'voto' : 'votos'}
                    </span>
                    {(featuredBook as any).genre && (
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {(featuredBook as any).genre.name}
                      </span>
                    )}
                  </div>
                  {hasRated && (
                    <p className="text-xs text-green-600 mb-3">Gracias por tu valoración</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => !hasItem(featuredBook.id, 'ebook') && addItem(featuredBook, 'ebook')}
                      disabled={hasItem(featuredBook.id, 'ebook')}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 ${
                        hasItem(featuredBook.id, 'ebook')
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {hasItem(featuredBook.id, 'ebook') ? 'En el carrito' : `${(((featuredBook as any).pricing?.base || featuredBook.price || 100) / 100).toFixed(2).replace('.', ',')} €`}
                    </button>
                    <Link
                      href={`/libro/${featuredBook.slug}`}
                      className="px-6 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center gap-2 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Ver detalles
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-xs uppercase tracking-wider text-gray-500">Páginas</span>
                      </div>
                      <p className="font-semibold">{featuredBook.pageCount || 'N/D'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs uppercase tracking-wider text-gray-500">Registro ATV</span>
                      </div>
                      <p className="font-semibold text-xs">{(featuredBook as any).registroAtomoVision || 'No incluido'}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Sinopsis</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {(featuredBook as any).synopsis || (featuredBook as any).excerpt || featuredBook.description_md || "Sin sinopsis disponible"}
                    </p>
                  </div>

                  {/* Detalles Técnicos */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Settings className="w-4 h-4" />
                      Detalles Técnicos de Creación
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Este libro ha sido generado mediante un proceso automatizado utilizando inteligencia artificial para crear una experiencia literaria única.
                    </p>
                    <div className="flex gap-6">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500">Texto</p>
                          <p className="font-medium text-gray-800 text-sm">{(featuredBook as any).aiGeneration?.textModel || (featuredBook as any).aiModel || "GPT-4 Turbo"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500">Portada</p>
                          <p className="font-medium text-gray-800 text-sm">{(featuredBook as any).aiGeneration?.coverModel || (featuredBook as any).coverAiModel || "DALL-E 3"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Info className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-gray-500">Idioma</p>
                          <p className="font-medium text-gray-800 text-sm">{featuredBook.language === 'es' ? 'Español' : featuredBook.language || "Español"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat con el libro */}
              <div className="lg:col-span-4">
                <div className="bg-gray-50 rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <h3 className="text-lg font-semibold">Explora el universo del libro</h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-3">
                      La IA te permite explorar cada rincón de este universo literario. 
                      Pregunta sobre los personajes, descubre los secretos del mundo, comprende las motivaciones ocultas 
                      o simplemente deja que el narrador te guíe por los misterios de la historia.
                    </p>
                    <div className="space-y-2 py-4">
                      <button 
                        onClick={() => handleQuickQuestion(homeSettings.chatQuestions.question1)}
                        disabled={!chatEnabled || isChatLoading}
                        className="text-sm bg-white px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &quot;{homeSettings.chatQuestions.question1}&quot;
                      </button>
                      <button 
                        onClick={() => handleQuickQuestion(homeSettings.chatQuestions.question2)}
                        disabled={!chatEnabled || isChatLoading}
                        className="text-sm bg-white px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &quot;{homeSettings.chatQuestions.question2}&quot;
                      </button>
                      <button 
                        onClick={() => handleQuickQuestion(homeSettings.chatQuestions.question3)}
                        disabled={!chatEnabled || isChatLoading}
                        className="text-sm bg-white px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &quot;{homeSettings.chatQuestions.question3}&quot;
                      </button>
                      <button 
                        onClick={() => handleQuickQuestion(homeSettings.chatQuestions.question4)}
                        disabled={!chatEnabled || isChatLoading}
                        className="text-sm bg-white px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &quot;{homeSettings.chatQuestions.question4}&quot;
                      </button>
                    </div>
                  </div>

                  <div ref={chatMessagesRef} className="bg-white rounded-lg p-4 flex-1 overflow-y-auto mb-4 max-h-[400px]">
                    <div className="space-y-3">
                      {chatMessages.map((message, index) => (
                        <div key={index} className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user' ? 'bg-gray-200' : 'bg-primary/10'
                          }`}>
                            {message.role === 'user' ? (
                              <span className="text-xs font-bold">TÚ</span>
                            ) : (
                              <BookOpen className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">
                              {message.role === 'user' ? 'Tú' : 'Narrador'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">Narrador</p>
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <form className="flex gap-2" onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value.slice(0, 500))}
                      placeholder={chatEnabled ? "Escribe tu pregunta..." : "Chat no disponible"}
                      disabled={!chatEnabled || isChatLoading}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-primary transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                      maxLength={500}
                    />
                    <button
                      type="submit"
                      disabled={!chatEnabled || isChatLoading || !chatInput.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>

                  {!chatEnabled && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      El chat no está disponible para este libro
                    </p>
                  )}
                  {chatEnabled && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Explora el universo literario • Respuestas únicas por IA
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Carrusel de Novedades */}
      <section className="pt-12 pb-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-playfair">Novedades</h2>
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {newBooks.map((book) => (
                <div key={book.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0">
                  <Link href={`/libro/${book.slug}`} className="block group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg mb-4">
                      {book.coverImage?.url ? (
                        <img
                          src={book.coverImage.url}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          style={{objectPosition: '75% center'}}
                        />
                      ) : (
                        <div className="w-full h-full bg-accent flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Nuevo</span>
                    </div>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.authors.join(', ')}</p>
                    <p className="text-lg font-bold mt-2">{(book.price / 100).toFixed(2)} €</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Más Vendidos */}
      <section className="py-12 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair mb-8">Más Vendidos</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {bestSellers.map((book, index) => {
              const format = book.formats.ebook ? 'ebook' : 'paperback'
              const isInCart = hasItem(book.id, format)
              
              return (
                <div key={book.id} className="bg-card rounded-lg overflow-hidden shadow-md group">
                  {/* Número de posición */}
                  <div className="relative">
                    <span className="absolute top-1 right-1 bg-black/80 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-10">
                      {index + 1}
                    </span>
                    
                    <Link href={`/libro/${book.slug}`} className="block relative aspect-[2/3] overflow-hidden">
                      {book.coverImage?.url ? (
                        <img
                          src={book.coverImage.url}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          style={{objectPosition: '75% center'}}
                        />
                      ) : (
                        <div className="w-full h-full bg-accent flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </Link>
                  </div>
                  
                  <div className="p-2">
                    <h3 className="font-semibold text-xs line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{book.authors.join(', ')}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{(book.price / 100).toFixed(2)} €</span>
                      <button
                        onClick={() => !isInCart && addItem(book, format)}
                        disabled={isInCart}
                        className={`p-1 rounded transition-colors ${
                          isInCart
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                        aria-label={isInCart ? "Ya en el carrito" : "Añadir al carrito"}
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Banner Informativo */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex justify-start mb-6">
              <div className="p-4 bg-gray-100 rounded-full">
                <Info className="w-12 h-12 text-gray-700" />
              </div>
            </div>
            <h2 className="text-3xl font-playfair mb-4 text-gray-900">¿Cómo funciona AtomoVisión?</h2>
            <p className="text-lg mb-8 text-gray-700">
              Somos la primera editorial que utiliza inteligencia artificial para crear libros únicos de fantasía y ciencia ficción. 
              Cada libro viene con un código de registro AtomoVisión que garantiza su autenticidad y te da acceso a contenido exclusivo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/editorial"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Conoce más sobre nosotros
              </Link>
              <Link
                href="/catalog"
                className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
              >
                Ver catálogo completo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
