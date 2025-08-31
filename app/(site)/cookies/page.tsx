import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | AtomoVisión',
  description: 'Información sobre el uso de cookies en AtomoVisión. Conoce qué cookies utilizamos y cómo gestionarlas.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <article className="container mx-auto px-4 max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Política de Cookies
          </h1>
          <p className="text-xl text-muted-foreground">
            Última actualización: Enero 2025
          </p>
        </header>

        <section className="space-y-8 mb-12">
          {/* Introducción */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">1. ¿Qué son las cookies?</h2>
            <p className="text-lg leading-relaxed mb-4">
              Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando 
              los visitas. Se utilizan para recordar información sobre tu visita, como tus preferencias o el 
              contenido de tu carrito de compra.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              En AtomoVisión utilizamos un número mínimo de cookies, todas ellas esenciales para el funcionamiento 
              básico de nuestro sitio web. No utilizamos cookies de publicidad, tracking o análisis invasivo.
            </p>
          </div>

          {/* Filosofía */}
          <div className="bg-primary/10 border-l-4 border-primary p-6 md:p-8 rounded-r-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">2. Nuestra Filosofía sobre Cookies</h2>
            <p className="text-lg leading-relaxed mb-4">
              Coherente con nuestra filosofía de privacidad, en AtomoVisión:
            </p>
            <ul className="space-y-2 mb-4 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Solo usamos cookies estrictamente necesarias</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No rastreamos tu comportamiento</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No creamos perfiles de usuario</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No vendemos datos a terceros</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">No usamos cookies de publicidad</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed">
              Creemos que puedes disfrutar de una experiencia web completa sin comprometer tu privacidad.
            </p>
          </div>

          {/* Tipos de cookies que usamos */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">3. Cookies que Utilizamos</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">3.1 Cookies Esenciales (Necesarias)</h3>
              <p className="text-lg leading-relaxed mb-4">
                Estas cookies son imprescindibles para que puedas navegar por el sitio web y usar sus funciones:
              </p>
              
              <div className="bg-accent/50 p-4 rounded-lg mb-4">
                <h4 className="font-bold mb-2">🛒 Cookies de Carrito de Compra</h4>
                <ul className="space-y-1 ml-4">
                  <li className="text-lg"><strong>Nombre:</strong> cart-storage</li>
                  <li className="text-lg"><strong>Duración:</strong> Sesión (se elimina al cerrar el navegador)</li>
                  <li className="text-lg"><strong>Función:</strong> Mantiene los productos en tu carrito mientras navegas</li>
                  <li className="text-lg"><strong>Datos almacenados:</strong> IDs de productos y cantidades</li>
                </ul>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg mb-4">
                <h4 className="font-bold mb-2">🔐 Cookies de Autenticación Admin</h4>
                <ul className="space-y-1 ml-4">
                  <li className="text-lg"><strong>Nombre:</strong> admin-token</li>
                  <li className="text-lg"><strong>Duración:</strong> 24 horas</li>
                  <li className="text-lg"><strong>Función:</strong> Mantiene la sesión del administrador</li>
                  <li className="text-lg"><strong>Datos almacenados:</strong> Token JWT cifrado</li>
                </ul>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg mb-4">
                <h4 className="font-bold mb-2">🎮 Cookies de Preferencias de Visualización</h4>
                <ul className="space-y-1 ml-4">
                  <li className="text-lg"><strong>Nombre:</strong> view-mode</li>
                  <li className="text-lg"><strong>Duración:</strong> 1 año</li>
                  <li className="text-lg"><strong>Función:</strong> Recuerda si prefieres navegación 2D o 3D</li>
                  <li className="text-lg"><strong>Datos almacenados:</strong> &quot;2D&quot; o &quot;3D&quot;</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">3.2 Almacenamiento Local (localStorage)</h3>
              <p className="text-lg leading-relaxed mb-4">
                Además de cookies, utilizamos el almacenamiento local del navegador para algunas funciones:
              </p>
              
              <div className="bg-accent/50 p-4 rounded-lg mb-4">
                <h4 className="font-bold mb-2">⭐ Calificaciones de Libros</h4>
                <ul className="space-y-1 ml-4">
                  <li className="text-lg"><strong>Clave:</strong> book-ratings</li>
                  <li className="text-lg"><strong>Duración:</strong> Permanente (hasta que lo borres)</li>
                  <li className="text-lg"><strong>Función:</strong> Guarda tus calificaciones de libros localmente</li>
                  <li className="text-lg"><strong>Privacidad:</strong> No se envía a nuestros servidores</li>
                </ul>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg mb-4">
                <h4 className="font-bold mb-2">🛍️ Estado del Carrito Persistente</h4>
                <ul className="space-y-1 ml-4">
                  <li className="text-lg"><strong>Clave:</strong> atomovision-cart</li>
                  <li className="text-lg"><strong>Duración:</strong> Permanente (hasta que lo borres)</li>
                  <li className="text-lg"><strong>Función:</strong> Mantiene tu carrito entre sesiones</li>
                  <li className="text-lg"><strong>Datos:</strong> Productos, cantidades y formatos</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">3.3 Cookies de Terceros</h3>
              <p className="text-lg leading-relaxed mb-4">
                Solo utilizamos servicios de terceros esenciales para el funcionamiento:
              </p>
              
              <div className="bg-accent/50 p-4 rounded-lg mb-4">
                <h4 className="font-bold mb-2">💳 Stripe (Procesamiento de Pagos)</h4>
                <ul className="space-y-1 ml-4">
                  <li className="text-lg"><strong>Cookies:</strong> __stripe_mid, __stripe_sid</li>
                  <li className="text-lg"><strong>Duración:</strong> Variable (gestionada por Stripe)</li>
                  <li className="text-lg"><strong>Función:</strong> Prevención de fraude y procesamiento seguro</li>
                  <li className="text-lg"><strong>Más info:</strong> <a href="https://stripe.com/cookies-policy/legal" target="_blank" rel="noopener noreferrer" className="text-primary underline">Política de Cookies de Stripe</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Cookies que NO usamos */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">4. Cookies que NO Utilizamos</h2>
            <p className="text-lg leading-relaxed mb-4">
              Es importante destacar que NO utilizamos:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">❌</span>
                <span className="text-lg"><strong>Cookies de publicidad:</strong> No mostramos anuncios ni rastreamos para publicidad</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">❌</span>
                <span className="text-lg"><strong>Cookies de análisis invasivo:</strong> No usamos Google Analytics ni similares</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">❌</span>
                <span className="text-lg"><strong>Cookies de redes sociales:</strong> No integramos botones de compartir que rastreen</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">❌</span>
                <span className="text-lg"><strong>Cookies de remarketing:</strong> No te perseguimos por internet</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">❌</span>
                <span className="text-lg"><strong>Cookies de perfilado:</strong> No creamos perfiles de comportamiento</span>
              </li>
            </ul>
          </div>

          {/* Gestión de cookies */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">5. Cómo Gestionar las Cookies</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">5.1 Control de Cookies en tu Navegador</h3>
              <p className="text-lg leading-relaxed mb-4">
                Todos los navegadores modernos te permiten controlar las cookies. Aquí te explicamos cómo:
              </p>
              
              <div className="space-y-4">
                <div className="bg-accent/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🌐 Google Chrome</h4>
                  <p className="text-lg">Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</p>
                </div>
                
                <div className="bg-accent/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🦊 Mozilla Firefox</h4>
                  <p className="text-lg">Opciones → Privacidad y seguridad → Cookies y datos del sitio</p>
                </div>
                
                <div className="bg-accent/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🧭 Safari</h4>
                  <p className="text-lg">Preferencias → Privacidad → Gestionar datos del sitio web</p>
                </div>
                
                <div className="bg-accent/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">🌊 Microsoft Edge</h4>
                  <p className="text-lg">Configuración → Cookies y permisos del sitio → Cookies y datos del sitio</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">5.2 Eliminar Cookies de AtomoVisión</h3>
              <p className="text-lg leading-relaxed mb-4">
                Para eliminar específicamente nuestras cookies:
              </p>
              <ol className="space-y-2 mb-6 ml-6">
                <li className="text-lg">1. Abre las herramientas de desarrollador (F12)</li>
                <li className="text-lg">2. Ve a la pestaña &quot;Application&quot; o &quot;Almacenamiento&quot;</li>
                <li className="text-lg">3. En el panel izquierdo, busca &quot;Cookies&quot;</li>
                <li className="text-lg">4. Selecciona www.atomovision.es</li>
                <li className="text-lg">5. Elimina las cookies que desees</li>
              </ol>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">5.3 Consecuencias de Desactivar Cookies</h3>
              <p className="text-lg leading-relaxed mb-4">
                Si decides bloquear o eliminar nuestras cookies esenciales:
              </p>
              <ul className="space-y-2 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">⚠️</span>
                  <span className="text-lg">El carrito de compra se vaciará al cerrar el navegador</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">⚠️</span>
                  <span className="text-lg">Tendrás que elegir entre 2D/3D cada vez que visites</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">⚠️</span>
                  <span className="text-lg">Los administradores deberán iniciar sesión frecuentemente</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-lg">Pero podrás seguir navegando y comprando (con limitaciones)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Consentimiento */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">6. Consentimiento y Cookies</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>6.1 ¿Necesitamos tu consentimiento?</strong>
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Según la legislación europea (RGPD y Directiva ePrivacy), las cookies estrictamente necesarias 
              para el funcionamiento del sitio NO requieren consentimiento previo. Como AtomoVisión solo 
              utiliza este tipo de cookies esenciales, no necesitamos mostrarte molestos banners de cookies.
            </p>
            
            <p className="text-lg leading-relaxed mb-4">
              <strong>6.2 Tu consentimiento implícito</strong>
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Al continuar navegando en nuestro sitio web después de haber sido informado sobre nuestra 
              política de cookies, entendemos que aceptas el uso de las cookies esenciales necesarias 
              para el funcionamiento básico del sitio.
            </p>
          </div>

          {/* Actualizaciones */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Actualizaciones de esta Política</h2>
            <p className="text-lg leading-relaxed mb-4">
              Podemos actualizar esta política de cookies ocasionalmente para reflejar cambios en la tecnología 
              o legislación. Los cambios serán efectivos al publicarse en esta página.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Si en el futuro decidiéramos usar cookies no esenciales (lo cual es poco probable dada nuestra 
              filosofía), implementaríamos un sistema de consentimiento explícito antes de su uso.
            </p>
          </div>

          {/* Más información */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">8. Más Información sobre Cookies</h2>
            <p className="text-lg leading-relaxed mb-4">
              Si deseas aprender más sobre las cookies en general, puedes visitar:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.aboutcookies.org</a> - Información general sobre cookies</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg"><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.allaboutcookies.org</a> - Guía completa sobre cookies</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">La documentación de tu navegador sobre gestión de cookies</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">9. Contacto</h2>
            <p className="text-lg leading-relaxed mb-4">
              Si tienes preguntas sobre nuestra política de cookies o cómo gestionamos estos datos:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="text-lg">Email: info@atomovision.es</li>
              <li className="text-lg">Formulario: www.atomovision.es/contact</li>
              <li className="text-lg">Asunto: &quot;Cookies - [Tu consulta]&quot;</li>
            </ul>
          </div>

          {/* Resumen visual */}
          <div className="bg-primary/10 border-l-4 border-primary p-6 md:p-8 rounded-r-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Resumen Visual de Nuestras Cookies</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">✅ Usamos:</h3>
                <ul className="space-y-2">
                  <li className="text-lg">• Cookies de carrito</li>
                  <li className="text-lg">• Cookies de sesión admin</li>
                  <li className="text-lg">• Preferencias de visualización</li>
                  <li className="text-lg">• Almacenamiento local mínimo</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-red-600">❌ NO usamos:</h3>
                <ul className="space-y-2">
                  <li className="text-lg">• Cookies de publicidad</li>
                  <li className="text-lg">• Tracking de comportamiento</li>
                  <li className="text-lg">• Análisis invasivo</li>
                  <li className="text-lg">• Perfilado de usuarios</li>
                </ul>
              </div>
            </div>
            
            <p className="text-lg font-bold text-center mt-6">
              Tu privacidad es nuestra prioridad. Usamos solo lo esencial.
            </p>
          </div>

          {/* Mensaje final */}
          <div className="text-center py-8 mt-12">
            <p className="text-xl font-bold mb-4">
              En AtomoVisión creemos que las cookies deben ser como un buen libro: 
              discretas, útiles y respetuosas con tu tiempo.
            </p>
            <p className="text-lg text-muted-foreground">
              Gracias por confiar en nosotros. Si tienes cualquier pregunta sobre cookies, no dudes en contactarnos.
            </p>
          </div>
        </section>
      </article>
    </div>
  )
}
