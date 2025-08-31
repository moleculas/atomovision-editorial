import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | AtomoVisión',
  description: 'Política de privacidad y protección de datos de AtomoVisión. Conoce cómo protegemos tu información personal.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <article className="container mx-auto px-4 max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Política de Privacidad
          </h1>
          <p className="text-xl text-muted-foreground">
            Última actualización: Enero 2025
          </p>
        </header>

        <section className="space-y-8 mb-12">
          {/* Introducción */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">1. Introducción</h2>
            <p className="text-lg leading-relaxed mb-4">
              En AtomoVisión nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política de privacidad 
              explica cómo recopilamos, usamos, almacenamos y protegemos tu información personal cuando utilizas nuestro 
              sitio web www.atomovision.es y adquieres nuestros libros digitales.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Nuestra filosofía de privacidad se basa en la recopilación mínima de datos: solo pedimos la información 
              estrictamente necesaria para proporcionar nuestros servicios. No requerimos registro de usuarios y 
              respetamos tu derecho a la privacidad.
            </p>
          </div>

          {/* Responsable */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">2. Responsable del Tratamiento</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>Responsable:</strong> AtomoVisión<br />
              <strong>Dominio web:</strong> www.atomovision.es<br />
              <strong>Email de contacto:</strong> info@atomovision.es<br />
              <strong>Actividad:</strong> Editorial digital especializada en libros de ciencia ficción y fantasía generados con IA
            </p>
          </div>

          {/* Datos recopilados */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">3. Datos que Recopilamos</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>3.1 Datos de compra (obligatorios):</strong>
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Dirección de email (para envío de enlaces de descarga)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Información de pago (procesada directamente por Stripe, no almacenada por nosotros)</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              <strong>3.2 Datos de navegación (automáticos):</strong>
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Dirección IP</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Tipo y versión del navegador</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Sistema operativo</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Páginas visitadas y tiempo de permanencia</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Fecha y hora de acceso</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              <strong>3.3 Datos opcionales:</strong>
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Nombre (si decides proporcionarlo en el formulario de contacto)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Mensajes enviados a través del formulario de contacto</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              <strong>3.4 Datos que NO recopilamos:</strong>
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No requerimos creación de cuentas de usuario</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No solicitamos datos personales adicionales (edad, género, ubicación)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No rastreamos tu comportamiento fuera de nuestro sitio</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No utilizamos píxeles de seguimiento de redes sociales</span>
              </li>
            </ul>
          </div>

          {/* Base legal */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">4. Base Legal para el Tratamiento</h2>
            <p className="text-lg leading-relaxed mb-4">
              Procesamos tus datos personales bajo las siguientes bases legales según el RGPD (Reglamento General de Protección de Datos):
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Ejecución contractual:</strong> Para procesar tu pedido y enviarte los libros digitales adquiridos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraude</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Consentimiento:</strong> Para comunicaciones opcionales y uso de cookies no esenciales</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Obligación legal:</strong> Para cumplir con obligaciones fiscales y legales</span>
              </li>
            </ul>
          </div>

          {/* Uso de datos */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">5. Cómo Usamos tus Datos</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>5.1 Usos principales:</strong>
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Procesar y completar tus pedidos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Enviarte los enlaces de descarga de los libros comprados</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Responder a tus consultas y proporcionar soporte</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Cumplir con nuestras obligaciones legales y fiscales</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              <strong>5.2 Usos secundarios:</strong>
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Mejorar la experiencia de usuario en nuestro sitio web</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Analizar patrones de uso de forma agregada y anónima</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Prevenir actividades fraudulentas o abusivas</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              <strong>5.3 Lo que NO hacemos con tus datos:</strong>
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No vendemos ni alquilamos tu información personal</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No enviamos marketing no solicitado</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No creamos perfiles detallados de usuarios</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No compartimos datos con terceros para publicidad</span>
              </li>
            </ul>
          </div>

          {/* Cookies */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">6. Cookies y Almacenamiento Local</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>6.1 Cookies esenciales:</strong> Utilizamos cookies técnicas necesarias para el funcionamiento del sitio:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Cookies de sesión para mantener tu carrito de compra</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Cookies de autenticación para el panel administrativo</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Preferencias de visualización (modo 2D/3D)</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              <strong>6.2 Almacenamiento local:</strong> Utilizamos el almacenamiento local del navegador para:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Guardar temporalmente el contenido del carrito</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Recordar tus preferencias de navegación</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Almacenar calificaciones de libros (localmente, sin enviar a servidor)</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              <strong>6.3 Cookies de terceros:</strong> Solo utilizamos cookies de servicios esenciales:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Stripe: Para procesar pagos de forma segura</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              Puedes gestionar o eliminar las cookies a través de la configuración de tu navegador, aunque esto puede 
              afectar la funcionalidad del sitio.
            </p>
          </div>

          {/* Terceros */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Compartición con Terceros</h2>
            <p className="text-lg leading-relaxed mb-4">
              Solo compartimos tu información con terceros en las siguientes circunstancias limitadas:
            </p>
            
            <p className="text-lg leading-relaxed mb-4">
              <strong>7.1 Proveedores de servicios esenciales:</strong>
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Stripe:</strong> Procesamiento seguro de pagos (PCI DSS compliant)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Resend:</strong> Envío de emails transaccionales</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>MongoDB Atlas:</strong> Almacenamiento seguro de datos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Vercel:</strong> Hosting y distribución del sitio web</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              <strong>7.2 Requisitos legales:</strong> Podemos divulgar información si es requerido por:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Orden judicial o requerimiento legal</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Protección de nuestros derechos legales</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Prevención de fraude o amenazas de seguridad</span>
              </li>
            </ul>

            <p className="text-lg leading-relaxed mb-4">
              <strong>7.3 Garantías:</strong> Todos nuestros proveedores están comprometidos contractualmente a:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Cumplir con el RGPD y otras leyes de privacidad aplicables</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Usar los datos solo para los fines especificados</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Implementar medidas de seguridad apropiadas</span>
              </li>
            </ul>
          </div>

          {/* Retención */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">8. Retención de Datos</h2>
            <p className="text-lg leading-relaxed mb-4">
              Conservamos tus datos personales solo durante el tiempo necesario para cumplir con los fines para los 
              que fueron recopilados:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Datos de compra:</strong> 5 años (obligación fiscal)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Emails de soporte:</strong> 2 años desde la última comunicación</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Logs de servidor:</strong> 90 días</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Enlaces de descarga:</strong> 7 días (se eliminan automáticamente)</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              Tras estos períodos, los datos se eliminan de forma segura o se anonimizan completamente para 
              fines estadísticos agregados.
            </p>
          </div>

          {/* Seguridad */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">9. Seguridad de los Datos</h2>
            <p className="text-lg leading-relaxed mb-4">
              Implementamos medidas técnicas y organizativas para proteger tus datos personales:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Conexiones cifradas (HTTPS) en todo el sitio</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Acceso restringido a datos personales (solo personal autorizado)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Contraseñas hasheadas y salteadas</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Backups regulares con cifrado</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Monitoreo de seguridad continuo</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Actualizaciones regulares de software</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              A pesar de estas medidas, ningún sistema es 100% seguro. En caso de brecha de seguridad que pueda 
              afectar tus derechos y libertades, te notificaremos según lo requiere la ley.
            </p>
          </div>

          {/* Derechos */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">10. Tus Derechos</h2>
            <p className="text-lg leading-relaxed mb-4">
              Bajo el RGPD, tienes los siguientes derechos sobre tus datos personales:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Acceso:</strong> Solicitar información sobre qué datos tenemos sobre ti</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Supresión:</strong> Solicitar la eliminación de tus datos (derecho al olvido)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Limitación:</strong> Restringir el procesamiento de tus datos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>Oposición:</strong> Oponerte a ciertos procesamientos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><strong>No ser objeto de decisiones automatizadas:</strong> Aunque no utilizamos perfilado automatizado</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              Para ejercer estos derechos, contáctanos en info@atomovision.es. Responderemos a tu solicitud 
              en un plazo máximo de 30 días. Podemos solicitar información adicional para verificar tu identidad.
            </p>
          </div>

          {/* Menores */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">11. Menores de Edad</h2>
            <p className="text-lg leading-relaxed mb-4">
              Nuestros servicios no están dirigidos a menores de 16 años. No recopilamos conscientemente información 
              personal de menores de esta edad. Si eres padre/madre o tutor y crees que tu hijo nos ha proporcionado 
              información personal, contáctanos para que podamos eliminar dichos datos.
            </p>
          </div>

          {/* Transferencias internacionales */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">12. Transferencias Internacionales</h2>
            <p className="text-lg leading-relaxed mb-4">
              Algunos de nuestros proveedores de servicios pueden procesar datos fuera del Espacio Económico Europeo (EEE). 
              En estos casos, nos aseguramos de que existan garantías adecuadas:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Cláusulas contractuales estándar de la UE</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Certificaciones de privacidad reconocidas</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Decisiones de adecuación de la Comisión Europea</span>
              </li>
            </ul>
          </div>

          {/* Cambios */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">13. Cambios en esta Política</h2>
            <p className="text-lg leading-relaxed mb-4">
              Podemos actualizar esta política de privacidad ocasionalmente para reflejar cambios en nuestras 
              prácticas o por requisitos legales. Los cambios serán efectivos al publicarse en esta página.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Si los cambios son sustanciales, te notificaremos mediante:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Aviso prominente en nuestro sitio web</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Email (si tenemos tu dirección por compras recientes)</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              Te recomendamos revisar periódicamente esta política para estar informado sobre cómo protegemos tu información.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">14. Contacto y Reclamaciones</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>14.1 Contacto directo:</strong> Para cualquier consulta sobre privacidad o para ejercer tus derechos:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="text-lg">Email: info@atomovision.es</li>
              <li className="text-lg">Formulario: www.atomovision.es/contact</li>
              <li className="text-lg">Asunto: &quot;Privacidad - [Tu consulta]&quot;</li>
            </ul>
            
            <p className="text-lg leading-relaxed mb-4">
              <strong>14.2 Autoridad de control:</strong> Si no estás satisfecho con nuestra respuesta, tienes derecho 
              a presentar una reclamación ante:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="text-lg">Agencia Española de Protección de Datos (AEPD)</li>
              <li className="text-lg">C/ Jorge Juan, 6, 28001 Madrid</li>
              <li className="text-lg">www.aepd.es</li>
            </ul>
          </div>

          {/* Compromiso final */}
          <div className="bg-primary/10 border-l-4 border-primary p-6 md:p-8 rounded-r-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">15. Nuestro Compromiso</h2>
            <p className="text-lg leading-relaxed mb-4">
              En AtomoVisión creemos que la privacidad es un derecho fundamental. Nuestro compromiso es:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Ser transparentes sobre qué datos recopilamos y por qué</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Recopilar solo la información mínima necesaria</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Proteger tus datos con las mejores prácticas de seguridad</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Respetar tus derechos y responder rápidamente a tus solicitudes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No vender ni compartir tus datos para publicidad</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed">
              <strong>Fecha de entrada en vigor:</strong> Esta política entra en vigor el 1 de enero de 2025.
            </p>
          </div>

          {/* Resumen final */}
          <div className="text-center py-8 mt-12">
            <p className="text-xl font-bold mb-4">
              Tu privacidad importa. En AtomoVisión practicamos la recopilación mínima de datos 
              y máxima transparencia.
            </p>
            <p className="text-lg text-muted-foreground">
              Si tienes cualquier duda sobre cómo manejamos tu información personal, no dudes en contactarnos.
            </p>
          </div>
        </section>
      </article>
    </div>
  )
}
