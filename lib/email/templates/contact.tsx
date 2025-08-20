import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ContactEmailProps {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactEmail({
  name,
  email,
  subject,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nuevo mensaje de contacto de {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Nuevo Mensaje de Contacto</Heading>
          
          <Section style={section}>
            <Text style={label}>De:</Text>
            <Text style={text}>{name}</Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Email:</Text>
            <Text style={text}>
              <a href={`mailto:${email}`} style={link}>{email}</a>
            </Text>
          </Section>

          <Section style={section}>
            <Text style={label}>Asunto:</Text>
            <Text style={text}>{subject}</Text>
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>Mensaje:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Este mensaje fue enviado desde el formulario de contacto de AtomoVisión.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Función para renderizar el template a HTML string
export function renderContactEmail(props: ContactEmailProps): string {
  const ReactDOMServer = require('react-dom/server')
  return ReactDOMServer.renderToStaticMarkup(<ContactEmail {...props} />)
}

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
}

const section = {
  padding: '0 48px',
  marginBottom: '16px',
}

const label = {
  color: '#666',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
}

const messageText = {
  color: '#333',
  fontSize: '16px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
  lineHeight: '24px',
}

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 48px',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '32px 0 0 0',
}
