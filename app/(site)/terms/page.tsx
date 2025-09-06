import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | AtomoVisión',
  description: 'Términos y condiciones de uso de AtomoVisión, editorial de libros de ciencia ficción y fantasía generados en colaboración con inteligencia artificial.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <article className="container mx-auto px-4 max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Términos y Condiciones
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
              Bienvenido a AtomoVisión. Estos términos y condiciones regulan el uso de nuestro sitio web www.atomovision.es 
              y la compra de libros digitales generados en colaboración con inteligencia artificial. Al acceder y utilizar 
              nuestros servicios, aceptas cumplir con estos términos.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              AtomoVisión es una editorial experimental que explora las posibilidades de la literatura creada mediante 
              la colaboración entre humanos e inteligencias artificiales. Nuestro catálogo incluye obras de ciencia ficción 
              y fantasía que nacen de esta sinergia creativa única.
            </p>
          </div>

          {/* Naturaleza del contenido */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">2. Naturaleza del Contenido y Proceso Creativo</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>2.1 Generación asistida por IA:</strong> Los libros disponibles en AtomoVisión son creados mediante 
              un proceso de colaboración entre autores humanos e inteligencia artificial. Los humanos aportan dirección 
              creativa, supervisión editorial y refinamiento estético, mientras que los sistemas de IA contribuyen con 
              generación de texto, exploración de ideas y capacidades combinatorias.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>2.2 Transparencia:</strong> AtomoVisión se compromete a la transparencia sobre el proceso creativo. 
              Cada libro indica claramente que ha sido generado en colaboración con IA. Creemos que esta colaboración 
              representa una nueva forma legítima de expresión creativa.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>2.3 Calidad y revisión:</strong> Aunque utilizamos IA en el proceso creativo, cada obra pasa por 
              un proceso de revisión y curación humana para asegurar coherencia narrativa, calidad literaria y ausencia 
              de contenido inapropiado.
            </p>
          </div>

          {/* Propiedad intelectual */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">3. Propiedad Intelectual</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>3.1 Derechos de AtomoVisión:</strong> Todo el contenido publicado en AtomoVisión, incluyendo textos, 
              imágenes, diseños y código, está protegido por derechos de autor. AtomoVisión mantiene todos los derechos 
              sobre las obras publicadas en su catálogo.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>3.2 Licencia de uso personal:</strong> Al comprar un libro digital, adquieres una licencia no exclusiva, 
              no transferible y revocable para uso personal. Esta licencia te permite:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Descargar y almacenar copias del libro en tus dispositivos personales</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Leer el libro para tu disfrute personal</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Realizar copias de seguridad para uso personal</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              <strong>3.3 Restricciones:</strong> No está permitido:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Revender, alquilar o prestar los libros digitales</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Distribuir públicamente o compartir los archivos</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Modificar, adaptar o crear obras derivadas</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Usar el contenido con fines comerciales</span>
              </li>
            </ul>
          </div>

          {/* Sin DRM */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">4. Política Sin DRM</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>4.1 Filosofía abierta:</strong> En coherencia con nuestra filosofía de democratización de la literatura, 
              los libros de AtomoVisión se distribuyen sin DRM (Digital Rights Management). Confiamos en nuestros lectores 
              para que respeten los derechos de autor y usen los libros de manera responsable.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>4.2 Responsabilidad del usuario:</strong> La ausencia de DRM no constituye una autorización para 
              la piratería o distribución no autorizada. Los usuarios son responsables de cumplir con las leyes de 
              propiedad intelectual aplicables.
            </p>
          </div>

          {/* Proceso de compra */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">5. Proceso de Compra y Registro</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>5.1 Compras sin registro:</strong> AtomoVisión permite realizar compras sin necesidad de crear 
              una cuenta de usuario. Solo requerimos una dirección de email válida para enviar los enlaces de descarga.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>5.2 Registro AtomoVisión:</strong> Cada libro físico incluye un código único de registro AtomoVisión 
              (formato ATV-XXXX-XXXX). Este código es obligatorio para ciertas funcionalidades especiales y debe ingresarse 
              al momento de la compra cuando sea aplicable.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>5.3 Proceso de pago:</strong> Los pagos se procesan de forma segura a través de Stripe. AtomoVisión 
              no almacena información de tarjetas de crédito en sus servidores.
            </p>
          </div>

          {/* Entrega y descargas */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">6. Entrega y Descargas</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>6.1 Entrega digital:</strong> Los libros se entregan exclusivamente en formato digital (EPUB) 
              mediante enlaces de descarga enviados al email proporcionado durante la compra.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>6.2 Límites de descarga:</strong> Por razones de seguridad, los enlaces de descarga tienen las 
              siguientes restricciones:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Validez de 7 días desde la compra</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Máximo 3 descargas por libro</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              <strong>6.3 Problemas de descarga:</strong> Si experimentas problemas con las descargas dentro del período 
              válido, contacta con nosotros a través de info@atomovision.es con tu número de pedido.
            </p>
          </div>

          {/* Precios y pagos */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Precios y Política de Reembolso</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>7.1 Precios:</strong> Todos los precios mostrados incluyen los impuestos aplicables. Los precios 
              están en euros (€) y pueden estar sujetos a cambios sin previo aviso, aunque los cambios no afectarán 
              a pedidos ya realizados.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>7.2 Sin reembolsos:</strong> Debido a la naturaleza digital e inmediata de nuestros productos, 
              todas las ventas son finales. No se aceptan devoluciones ni reembolsos una vez que se ha completado 
              la compra y se han enviado los enlaces de descarga.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>7.3 Excepciones:</strong> Solo se considerarán reembolsos en casos de:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Error técnico que impida completamente el acceso al contenido</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Cobro duplicado por error del sistema</span>
              </li>
            </ul>
          </div>

          {/* Uso del sitio web */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">8. Uso del Sitio Web</h2>
            {/* <p className="text-lg leading-relaxed mb-4">
              <strong>8.1 Experiencia 3D:</strong> AtomoVisión ofrece una experiencia de navegación 3D única. Esta 
              funcionalidad requiere un navegador moderno con soporte WebGL. Proporcionamos una alternativa 2D para 
              dispositivos no compatibles.
            </p>             */}
            <p className="text-lg leading-relaxed mb-4">
              <strong>8.1 Uso aceptable:</strong> Los usuarios se comprometen a utilizar el sitio web de manera legal 
              y respetuosa, sin intentar:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Acceder a áreas restringidas del sitio</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Interferir con el funcionamiento del servicio</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Extraer datos de forma automatizada</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Realizar ingeniería inversa del código</span>
              </li>
            </ul>
          </div>

          {/* Privacidad */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">9. Privacidad y Datos Personales</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>9.1 Recopilación mínima:</strong> AtomoVisión recopila únicamente los datos necesarios para 
              procesar tu pedido: dirección de email y información de pago procesada por Stripe.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>9.2 Uso de datos:</strong> Tu email se utilizará exclusivamente para:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Enviar enlaces de descarga</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Comunicaciones relacionadas con tu pedido</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-lg">Responder a consultas de soporte</span>
              </li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              <strong>9.3 No compartimos datos:</strong> No vendemos, alquilamos ni compartimos tu información personal 
              con terceros, excepto cuando sea necesario para procesar pagos (Stripe) o cumplir con obligaciones legales.
            </p>
          </div>

          {/* Limitación de responsabilidad */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">10. Limitación de Responsabilidad</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>10.1 Contenido generado por IA:</strong> Aunque supervisamos y curamos todo el contenido, los 
              libros generados con IA pueden contener imprecisiones, inconsistencias o elementos inesperados propios 
              del proceso creativo experimental.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>10.2 Sin garantías:</strong> Los productos se proporcionan &quot;tal cual&quot; sin garantías de ningún 
              tipo, expresas o implícitas.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>10.3 Limitación:</strong> En ningún caso AtomoVisión será responsable por daños indirectos, 
              incidentales, especiales o consecuentes derivados del uso o imposibilidad de uso de nuestros productos.
            </p>
          </div>

          {/* Modificaciones */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">11. Modificaciones de los Términos</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>11.1 Derecho de modificación:</strong> AtomoVisión se reserva el derecho de modificar estos 
              términos en cualquier momento. Los cambios entrarán en vigor al publicarse en el sitio web.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>11.2 Notificación:</strong> Los cambios sustanciales se comunicarán mediante aviso en el sitio 
              web. El uso continuado del servicio tras las modificaciones constituye aceptación de los nuevos términos.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">12. Contacto y Resolución de Disputas</h2>
            <p className="text-lg leading-relaxed mb-4">
              <strong>12.1 Contacto:</strong> Para cualquier consulta sobre estos términos o nuestros servicios:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="text-lg">Email: info@atomovision.es</li>
              <li className="text-lg">Formulario: www.atomovision.es/contact</li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
              <strong>12.2 Ley aplicable:</strong> Estos términos se rigen por las leyes de España. Cualquier disputa 
              se resolverá en los tribunales de Barcelona, España.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>12.3 Resolución amistosa:</strong> Antes de iniciar cualquier acción legal, las partes se 
              comprometen a intentar resolver cualquier disputa de manera amistosa mediante comunicación directa.
            </p>
          </div>

          {/* Cláusula final */}
          <div className="bg-primary/10 border-l-4 border-primary p-6 md:p-8 rounded-r-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">13. Aceptación de los Términos</h2>
            <p className="text-lg leading-relaxed mb-4">
              Al utilizar el sitio web de AtomoVisión o comprar nuestros productos, confirmas que has leído, 
              entendido y aceptado estos términos y condiciones en su totalidad.
            </p>
            <p className="text-lg leading-relaxed">
              <strong>Fecha de entrada en vigor:</strong> Estos términos entran en vigor el 1 de enero de 2025 
              y sustituyen a cualquier versión anterior.
            </p>
          </div>

          {/* Manifiesto resumido */}
          <div className="text-center py-8 mt-12">
            <p className="text-xl font-bold mb-4">
              AtomoVisión es más que una editorial: es un experimento en las nuevas formas de creatividad 
              que emergen de la colaboración entre humanos e inteligencia artificial.
            </p>
            <p className="text-lg text-muted-foreground">
              Estos términos reflejan nuestra filosofía de apertura, experimentación y respeto mutuo entre 
              creadores y lectores en la era de la narrativa algorítmica.
            </p>
          </div>
        </section>
      </article>
    </div>
  )
}
