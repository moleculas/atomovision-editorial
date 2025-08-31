import resend from './client'
// Importar render de React Email
import { render } from '@react-email/render'
import ContactEmail from './templates/contact'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  template: 'contact' | 'purchase' | 'download'
  data: any
}

export async function sendEmail({
  to,
  subject,
  template,
  data,
}: SendEmailOptions) {
  try {
    // Verificar que tenemos API key
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no está configurada')
    }

    let html = ''

    switch (template) {
      case 'contact':
        try {
          // Intentar usar React Email con el método render oficial
          const rendered = render(ContactEmail(data))

          // Si es una promesa, esperarla
          if (rendered instanceof Promise) {
            const result = await rendered as any

            if (typeof result === 'object' && result.html) {
              html = result.html
            } else if (typeof result === 'string') {
              html = result
            } else {
              throw new Error('Formato de render inesperado después de await')
            }
          } else if (typeof rendered === 'object' && (rendered as any).html) {
            html = (rendered as any).html
          } else if (typeof rendered === 'string') {
            html = rendered
          } else {
            throw new Error('Formato de render inesperado')
          }
        } catch (renderError) {
          // Fallback a HTML simple
          html = `
            <h2>Nuevo Mensaje de Contacto</h2>
            <p><strong>De:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Asunto:</strong> ${data.subject}</p>
            <hr>
            <p><strong>Mensaje:</strong></p>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Este mensaje fue enviado desde el formulario de contacto de AtomoVisión.</small></p>
          `
        }
        break
      case 'purchase':
      case 'download':
        throw new Error(`Template ${template} no implementado aún`)
      default:
        throw new Error(`Template desconocido: ${template}`)
    }

    // Verificar que html sea un string válido
    if (!html || typeof html !== 'string') {
      throw new Error('Failed to render email template')
    }

    // Enviar email
    const from = process.env.EMAIL_FROM || 'AtomoVisión <onboarding@resend.dev>'

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    // Verificar si hay error en la respuesta
    if (result.error) {
      throw new Error(result.error.message || 'Error al enviar email')
    }

    return { success: true, data: result }
  } catch (error) {
    return { success: false, error }
  }
}

// Helper específico para emails de contacto
export async function sendContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  return sendEmail({
    to: process.env.CONTACT_EMAIL || 'info@atomovision.es',
    subject: `[Contacto Web] ${data.subject}`,
    template: 'contact',
    data,
  })
}
