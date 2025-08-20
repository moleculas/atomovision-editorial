'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '' // Campo trampa para bots
  })
  
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus({
          type: 'success',
          message: data.message || 'Mensaje enviado correctamente'
        })
        // Limpiar formulario
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          honeypot: ''
        })
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Error al enviar el mensaje'
        })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Error de conexión. Por favor, intenta más tarde.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header más compacto */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair mb-2">Contacto</h1>
            <p className="text-muted-foreground">
              ¿Tienes alguna pregunta? Escríbenos.
            </p>
          </div>

          {/* Status Messages */}
          {status.type && (
            <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
              status.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <p>{status.message}</p>
            </div>
          )}

          {/* Form más compacto */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Nombre y Email en la misma línea */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Asunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            {/* Message más compacto */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`
                  inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all
                  ${loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
                  }
                `}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar mensaje
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info adicional más compacta */}
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              También puedes escribirnos a{' '}
              <a
                href="mailto:contacto@atomovision.com"
                className="text-primary hover:underline"
              >
                contacto@atomovision.com
              </a>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Respondemos en 48 horas hábiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
