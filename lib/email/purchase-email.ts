import { Resend } from 'resend'
import PurchaseEmailTemplate from './templates/PurchaseEmailTemplate'
import { renderToStaticMarkup } from 'react-dom/server'

const resend = new Resend(process.env.RESEND_API_KEY)

interface PurchaseItem {
  book: {
    _id: string
    title: string
    subtitle?: string
    authors: string[]
    coverImage?: {
      url: string
    }
  }
  format: string
  quantity: number
  price: number
}

interface Purchase {
  _id: string
  email: string
  customerName?: string
  items: PurchaseItem[]
  totalAmount: number
  downloadToken: string
  createdAt: Date
}

export async function sendPurchaseEmail(purchase: Purchase) {
  try {
    // Generar URLs de descarga para cada libro
    const downloadLinks = purchase.items.map(item => ({
      bookId: item.book._id.toString(),
      title: item.book.title,
      format: item.format,
      downloadUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/download/${purchase.downloadToken}?book=${item.book._id}`
    }))

    // Intentar enviar con React Email template
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'AtomoVisión <onboarding@resend.dev>',
        to: purchase.email,
        subject: `Tu pedido en AtomoVisión - Enlaces de descarga`,
        react: PurchaseEmailTemplate({
          customerName: purchase.customerName || 'Cliente',
          orderNumber: purchase._id.toString(),
          orderDate: purchase.createdAt,
          items: purchase.items.map(item => ({
            title: item.book.title,
            subtitle: item.book.subtitle,
            authors: item.book.authors,
            format: item.format === 'ebook' ? 'eBook' : 'Tapa blanda',
            quantity: item.quantity,
            price: item.price,
            coverImage: item.book.coverImage?.url
          })),
          totalAmount: purchase.totalAmount,
          downloadLinks,
          supportEmail: process.env.CONTACT_EMAIL || 'atomovisionweb@gmail.com'
        }),
      })

      if (error) {
        throw error
      }

      return { success: true, data }
    } catch (reactEmailError) {
      console.error('Error con React Email template, usando HTML fallback:', reactEmailError)
      
      // Fallback a HTML simple
      const htmlContent = generateFallbackHTML(purchase, downloadLinks)
      
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'AtomoVisión <onboarding@resend.dev>',
        to: purchase.email,
        subject: `Tu pedido en AtomoVisión - Enlaces de descarga`,
        html: htmlContent,
      })

      if (error) {
        throw error
      }

      return { success: true, data }
    }
  } catch (error) {
    console.error('Error enviando email de compra:', error)
    throw error
  }
}

function generateFallbackHTML(purchase: Purchase, downloadLinks: any[]) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tu pedido en AtomoVisión</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #e11d48;">¡Gracias por tu compra!</h1>
      
      <p>Hola ${purchase.customerName || 'Cliente'},</p>
      
      <p>Tu pedido se ha completado exitosamente. A continuación encontrarás los enlaces de descarga para tus libros.</p>
      
      <h2>Enlaces de descarga:</h2>
      <ul>
        ${downloadLinks.map(link => `
          <li style="margin-bottom: 10px;">
            <strong>${link.title}</strong> (${link.format})<br>
            <a href="${link.downloadUrl}" style="color: #e11d48;">Descargar libro</a>
          </li>
        `).join('')}
      </ul>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Información importante:</h3>
        <ul>
          <li>Los enlaces son válidos por 7 días</li>
          <li>Puedes descargar cada libro hasta 3 veces</li>
          <li>Los libros no tienen DRM</li>
        </ul>
      </div>
      
      <p><strong>Total pagado:</strong> ${(purchase.totalAmount / 100).toFixed(2)} €</p>
      
      <hr style="margin: 30px 0;">
      
      <p style="font-size: 14px; color: #666;">
        Si tienes algún problema con las descargas, contáctanos en 
        <a href="mailto:${process.env.CONTACT_EMAIL}" style="color: #e11d48;">${process.env.CONTACT_EMAIL}</a>
      </p>
      
      <p style="font-size: 14px; color: #666;">
        © ${new Date().getFullYear()} AtomoVisión. Todos los derechos reservados.
      </p>
    </body>
    </html>
  `
}
