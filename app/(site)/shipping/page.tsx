import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Envíos y Devoluciones | AtomoVisión',
  description: 'Información sobre la entrega de libros digitales y política de devoluciones en AtomoVisión',
  robots: 'noindex, nofollow',
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <article className="container mx-auto px-4 max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Envíos y Devoluciones
          </h1>
          <p className="text-xl text-muted-foreground">
            Información sobre la entrega de nuestros libros digitales
          </p>
        </header>

        <section className="space-y-8 mb-12">
          {/* Introducción */}
          <div className="bg-primary/10 border-l-4 border-primary p-6 md:p-8 rounded-r-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Entrega 100% Digital</h2>
            <p className="text-lg leading-relaxed mb-4">
              En AtomoVisión todos nuestros productos son digitales. No enviamos productos físicos, 
              lo que significa:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span className="text-lg"><strong>Sin gastos de envío</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span className="text-lg"><strong>Entrega inmediata</strong> tras el pago</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span className="text-lg"><strong>Sin esperas</strong> ni problemas logísticos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span className="text-lg"><strong>Ecológico</strong> - sin huella de carbono por transporte</span>
              </li>
            </ul>
          </div>

          {/* Proceso de entrega */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">1. Proceso de Entrega</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">1.1 ¿Cómo recibes tu libro?</h3>
              <p className="text-lg leading-relaxed mb-4">
                El proceso es simple y automático:
              </p>
              <ol className="space-y-3 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">1.</span>
                  <span className="text-lg">Completas tu compra a través de nuestro sistema seguro de pago</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">2.</span>
                  <span className="text-lg">Recibes un email de confirmación en la dirección proporcionada</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">3.</span>
                  <span className="text-lg">El email contiene enlaces únicos de descarga para cada libro</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">4.</span>
                  <span className="text-lg">Descargas tus libros en formato EPUB</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">5.</span>
                  <span className="text-lg">¡Listo para leer en tu dispositivo favorito!</span>
                </li>
              </ol>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">1.2 Tiempo de entrega</h3>
              <p className="text-lg leading-relaxed mb-4">
                La entrega es <strong>inmediata</strong>. Normalmente recibirás el email con los enlaces 
                de descarga en menos de 5 minutos después de completar el pago. En casos excepcionales, 
                puede tardar hasta 15 minutos.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">1.3 Límites de descarga</h3>
              <div className="bg-accent/50 p-4 rounded-lg">
                <p className="text-lg leading-relaxed mb-4">
                  Por seguridad, los enlaces de descarga tienen las siguientes restricciones:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-lg"><strong>Validez:</strong> 7 días desde la compra</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-lg"><strong>Número de descargas:</strong> Máximo 3 por libro</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-lg"><strong>Recomendación:</strong> Descarga y guarda una copia de seguridad</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Problemas con la entrega */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">2. ¿Problemas con la Entrega?</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">2.1 No he recibido el email</h3>
              <p className="text-lg leading-relaxed mb-4">
                Si no recibes el email en 15 minutos:
              </p>
              <ol className="space-y-2 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">1.</span>
                  <span className="text-lg">Revisa tu carpeta de spam o correo no deseado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">2.</span>
                  <span className="text-lg">Verifica que el email introducido sea correcto</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">3.</span>
                  <span className="text-lg">Añade info@atomovision.es a tu lista de contactos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">4.</span>
                  <span className="text-lg">Contáctanos con tu número de pedido</span>
                </li>
              </ol>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">2.2 El enlace ha expirado</h3>
              <p className="text-lg leading-relaxed mb-4">
                Si tu enlace ha expirado (más de 7 días) o has superado el límite de descargas, 
                contáctanos en info@atomovision.es con:
              </p>
              <ul className="space-y-2 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Tu número de pedido</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Email usado en la compra</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Fecha aproximada de compra</span>
                </li>
              </ul>
              <p className="text-lg leading-relaxed mb-4">
                Evaluaremos tu caso y, si procede, te enviaremos nuevos enlaces de descarga.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">2.3 Error al descargar</h3>
              <p className="text-lg leading-relaxed mb-4">
                Si experimentas errores técnicos durante la descarga:
              </p>
              <ul className="space-y-2 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Intenta con otro navegador</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Desactiva temporalmente extensiones del navegador</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Verifica tu conexión a internet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Si persiste, contáctanos para asistencia</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Política de devoluciones */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">3. Política de Devoluciones</h2>
            
            <div className="bg-accent/50 p-4 rounded-lg mb-6">
              <p className="text-lg leading-relaxed font-bold mb-2">
                ⚠️ Importante: Productos digitales
              </p>
              <p className="text-lg leading-relaxed">
                De acuerdo con la legislación europea sobre productos digitales, al completar la compra 
                y descargar el contenido, renuncias a tu derecho de desistimiento de 14 días. Esto es 
                porque el contenido digital se entrega de forma inmediata y completa.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">3.1 Política general</h3>
              <p className="text-lg leading-relaxed mb-4">
                Debido a la naturaleza digital de nuestros productos:
              </p>
              <ul className="space-y-2 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg"><strong>No aceptamos devoluciones</strong> una vez descargado el producto</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg"><strong>No ofrecemos reembolsos</strong> después de la entrega</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Todas las ventas son <strong>finales</strong></span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">3.2 Excepciones</h3>
              <p className="text-lg leading-relaxed mb-4">
                Solo consideraremos reembolsos en estos casos excepcionales:
              </p>
              <ul className="space-y-2 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-lg"><strong>Error técnico grave:</strong> El archivo está corrupto y no podemos proporcionar uno funcional</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-lg"><strong>Cobro duplicado:</strong> Se te ha cobrado más de una vez por el mismo pedido</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-lg"><strong>No entrega:</strong> No recibes el producto y no podemos resolver el problema</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">3.3 Cómo solicitar asistencia</h3>
              <p className="text-lg leading-relaxed mb-4">
                Si crees que tu caso califica para una excepción:
              </p>
              <ol className="space-y-2 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">1.</span>
                  <span className="text-lg">Contáctanos en las primeras 48 horas tras la compra</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">2.</span>
                  <span className="text-lg">Incluye tu número de pedido y descripción del problema</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">3.</span>
                  <span className="text-lg">Adjunta capturas de pantalla si es un error técnico</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 font-bold">4.</span>
                  <span className="text-lg">Responderemos en un máximo de 48 horas laborables</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Formatos y compatibilidad */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">4. Formatos y Compatibilidad</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">4.1 Formato EPUB</h3>
              <p className="text-lg leading-relaxed mb-4">
                Todos nuestros libros se entregan en formato <strong>EPUB</strong>, el estándar más 
                universal para libros electrónicos. Este formato es compatible con:
              </p>
              <ul className="space-y-2 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">La mayoría de e-readers (excepto Kindle básico)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Apps móviles (Apple Books, Google Play Books, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Software de escritorio (Calibre, Adobe Digital Editions)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Navegadores web con extensiones EPUB</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">4.2 Para usuarios de Kindle</h3>
              <p className="text-lg leading-relaxed mb-4">
                Si tienes un Kindle, puedes convertir fácilmente EPUB a MOBI/AZW3 usando:
              </p>
              <ul className="space-y-2 mb-6 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg"><strong>Calibre:</strong> Software gratuito de gestión de ebooks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg"><strong>Send to Kindle:</strong> Servicio de Amazon</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-lg">Conversores online gratuitos</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">5. Contacto para Soporte</h2>
            <p className="text-lg leading-relaxed mb-4">
              Para cualquier problema relacionado con la entrega de tus libros:
            </p>
            <div className="bg-primary/10 border-l-4 border-primary p-6 md:p-8 rounded-r-lg">
              <ul className="space-y-2">
                <li className="text-lg"><strong>Email:</strong> info@atomovision.es</li>
                <li className="text-lg"><strong>Asunto sugerido:</strong> &quot;Problema de entrega - [Número de pedido]&quot;</li>
                <li className="text-lg"><strong>Tiempo de respuesta:</strong> 24-48 horas laborables</li>
                <li className="text-lg"><strong>Horario de soporte:</strong> Lunes a Viernes, 9:00 - 18:00 (CET)</li>
              </ul>
            </div>
          </div>

          {/* Ventajas de lo digital */}
          <div className="bg-primary/10 border-l-4 border-primary p-6 md:p-8 rounded-r-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ventajas de los Libros Digitales</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">Para ti:</h3>
                <ul className="space-y-2">
                  <li className="text-lg">• Lectura inmediata</li>
                  <li className="text-lg">• Sin gastos de envío</li>
                  <li className="text-lg">• Biblioteca portátil</li>
                  <li className="text-lg">• Búsqueda de texto</li>
                  <li className="text-lg">• Ajuste de fuente</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">Para el planeta:</h3>
                <ul className="space-y-2">
                  <li className="text-lg">• Sin papel ni tinta</li>
                  <li className="text-lg">• Sin transporte físico</li>
                  <li className="text-lg">• Sin almacenes</li>
                  <li className="text-lg">• Huella de carbono mínima</li>
                  <li className="text-lg">• 100% sostenible</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mensaje final */}
          <div className="text-center py-8 mt-12">
            <p className="text-xl font-bold mb-4">
              En AtomoVisión, la magia de la lectura llega a ti sin demoras ni complicaciones.
            </p>
            <p className="text-lg text-muted-foreground">
              Libros digitales generados con IA, entregados instantáneamente para tu disfrute inmediato.
            </p>
          </div>
        </section>
      </article>
    </div>
  )
}
