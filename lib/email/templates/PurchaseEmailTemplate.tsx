import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface PurchaseItem {
  title: string
  subtitle?: string
  authors: string[]
  format: string
  quantity: number
  price: number
  coverImage?: string
}

interface DownloadLink {
  bookId: string
  title: string
  format: string
  downloadUrl: string
}

interface PurchaseEmailTemplateProps {
  customerName: string
  orderNumber: string
  orderDate: Date
  items: PurchaseItem[]
  totalAmount: number
  downloadLinks: DownloadLink[]
  supportEmail: string
}

export default function PurchaseEmailTemplate({
  customerName,
  orderNumber,
  orderDate,
  items,
  totalAmount,
  downloadLinks,
  supportEmail,
}: PurchaseEmailTemplateProps) {
  const previewText = `Tu pedido en AtomoVisión - Enlaces de descarga disponibles`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>AtomoVisión</Heading>
            <Text style={tagline}>Editorial de ciencia ficción y fantasía generada por IA</Text>
          </Section>

          {/* Contenido principal */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              ¡Gracias por tu compra, {customerName}!
            </Heading>
            
            <Text style={paragraph}>
              Tu pedido #{orderNumber.slice(-8)} se ha completado exitosamente.
              A continuación encontrarás los enlaces de descarga para tus libros.
            </Text>

            {/* Enlaces de descarga */}
            <Section style={downloadSection}>
              <Heading as="h3" style={h3}>Enlaces de descarga:</Heading>
              {downloadLinks.map((link, index) => (
                <div key={index} style={downloadItem}>
                  <Text style={bookTitle}>{link.title}</Text>
                  <Text style={bookFormat}>Formato: {link.format}</Text>
                  <Button
                    href={link.downloadUrl}
                    style={downloadButton}
                  >
                    Descargar libro
                  </Button>
                </div>
              ))}
            </Section>

            {/* Información importante */}
            <Section style={infoBox}>
              <Heading as="h3" style={h3}>Información importante:</Heading>
              <ul style={list}>
                <li>Los enlaces son válidos por <strong>7 días</strong></li>
                <li>Puedes descargar cada libro hasta <strong>3 veces</strong></li>
                <li>Los libros <strong>no tienen DRM</strong> - puedes leerlos en cualquier dispositivo</li>
                <li>Guarda este email para futuras descargas</li>
              </ul>
            </Section>

            {/* Resumen del pedido */}
            <Section style={orderSummary}>
              <Heading as="h3" style={h3}>Resumen del pedido:</Heading>
              <table style={table}>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td style={tableCell}>
                        {item.title} ({item.format}) x{item.quantity}
                      </td>
                      <td style={tableCellRight}>
                        {(item.price * item.quantity / 100).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td style={tableCellTotal}><strong>Total</strong></td>
                    <td style={tableCellTotalRight}>
                      <strong>{(totalAmount / 100).toFixed(2)} €</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr style={hr} />

            {/* Footer */}
            <Text style={footer}>
              Si tienes algún problema con las descargas, no dudes en contactarnos en{' '}
              <Link href={`mailto:${supportEmail}`} style={link}>
                {supportEmail}
              </Link>
            </Text>

            <Text style={footer}>
              © {new Date().getFullYear()} AtomoVisión. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '32px 20px',
  backgroundColor: '#e11d48',
  color: '#ffffff',
  textAlign: 'center' as const,
}

const h1 = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 8px',
}

const tagline = {
  color: '#fecaca',
  fontSize: '14px',
  margin: '0',
}

const content = {
  padding: '32px 40px',
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '0 0 24px',
}

const h3 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const paragraph = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px',
}

const downloadSection = {
  margin: '32px 0',
}

const downloadItem = {
  backgroundColor: '#f9fafb',
  padding: '16px',
  borderRadius: '8px',
  marginBottom: '16px',
}

const bookTitle = {
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const bookFormat = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 12px',
}

const downloadButton = {
  backgroundColor: '#e11d48',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
  display: 'inline-block',
}

const infoBox = {
  backgroundColor: '#eff6ff',
  padding: '20px',
  borderRadius: '8px',
  margin: '32px 0',
}

const list = {
  paddingLeft: '20px',
  margin: '0',
}

const orderSummary = {
  margin: '32px 0',
}

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

const tableCell = {
  padding: '8px 0',
  borderBottom: '1px solid #e5e7eb',
}

const tableCellRight = {
  padding: '8px 0',
  borderBottom: '1px solid #e5e7eb',
  textAlign: 'right' as const,
}

const tableCellTotal = {
  padding: '12px 0 8px',
  borderTop: '2px solid #e5e7eb',
}

const tableCellTotalRight = {
  padding: '12px 0 8px',
  borderTop: '2px solid #e5e7eb',
  textAlign: 'right' as const,
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
  textAlign: 'center' as const,
}

const link = {
  color: '#e11d48',
  textDecoration: 'underline',
}
