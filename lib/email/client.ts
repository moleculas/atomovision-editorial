import { Resend } from 'resend'

// Inicializar cliente de Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export default resend
