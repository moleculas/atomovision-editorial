'use client'

import { useState, useRef, useEffect } from 'react'
import { useUIStore } from '@/lib/store'
import { MessageSquare, X, Send } from 'lucide-react'

export function ChatInterface() {
  const { isChatOpen, setIsChatOpen } = useUIStore()
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([{
    role: 'assistant',
    content: '¡Saludos, viajero! Soy el Bibliotecario, guardián de los mundos infinitos. ¿En qué puedo ayudarte?'
  }])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    
    // Añadir mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: inputMessage }])
    setInputMessage('')
    setIsTyping(true)
    
    // Simular respuesta del bibliotecario (temporal)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Disculpa, aún estoy aprendiendo. Pronto podré guiarte a través de los reinos literarios...'
      }])
      setIsTyping(false)
    }, 1500)
  }
  
  return (
    <>
      {/* Botón activador del chat */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed top-20 left-4 z-50 bg-black/80 backdrop-blur-sm border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black/90 hover:border-cyan-400 transition-all duration-300 group"
          style={{ boxShadow: '0 0 20px rgba(0, 255, 204, 0.3)' }}
        >
          <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Consultar al Bibliotecario</span>
        </button>
      )}
      
      {/* Panel del chat */}
      {isChatOpen && (
        <div 
          className="fixed top-20 left-4 z-50 w-[400px] h-[500px] bg-black/90 backdrop-blur-md border border-cyan-500/50 rounded-xl overflow-hidden flex flex-col"
          style={{ boxShadow: '0 0 30px rgba(0, 255, 204, 0.4)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 px-4 py-3 flex justify-between items-center border-b border-cyan-500/30">
            <h3 className="text-cyan-300 font-semibold flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              El Bibliotecario
            </h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-cyan-400/70 hover:text-cyan-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-cyan-800/50 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-600/30'
                      : 'bg-blue-900/30 text-blue-100 border border-blue-700/30'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-blue-900/30 text-blue-100 px-3 py-2 rounded-lg text-sm border border-blue-700/30">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="border-t border-cyan-500/30 p-3">
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pregunta al Bibliotecario..."
                className="flex-1 bg-black/50 border border-cyan-600/30 rounded-lg px-3 py-2 text-cyan-100 placeholder-cyan-600/50 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="bg-cyan-600/20 hover:bg-cyan-600/30 disabled:bg-gray-800/20 disabled:text-gray-600 text-cyan-400 p-2 rounded-lg transition-colors border border-cyan-600/30 hover:border-cyan-500"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
