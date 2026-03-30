export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8">Política de Cookies</h1>

        <div className="max-w-3xl space-y-6 text-gray-600">
          <p>
            Esta política explica qué son las cookies, cómo las usamos y tus 
            opciones respecto a su uso en MODACOLOMBIA.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">1. ¿Qué son las Cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu 
              dispositivo cuando visitas un sitio web. Ayudan a reconocer tu 
              navegador y recordar información sobre tu visita.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">2. Tipos de Cookies que Usamos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Esenciales:</strong> Necesarias para el funcionamiento del sitio (carrito, login)</li>
              <li><strong>Analíticas:</strong> Nos ayudan a entender cómo usas el sitio (Google Analytics)</li>
              <li><strong>Marketing:</strong> Para mostrarte publicidad relevante</li>
              <li><strong>Preferencias:</strong> Guardan tus configuraciones</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">3. Cómo Gestionar Cookies</h2>
            <p>
              Puedes configurar tu navegador para rechazar cookies o eliminarlas. 
              Ten en cuenta que algunas funciones del sitio pueden no funcionar 
              si deshabilitas las cookies esenciales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">4. Cookies de Terceros</h2>
            <p>
              Usamos servicios de terceros como Google Analytics y Facebook Pixel 
              que también pueden colocar cookies. No tenemos control sobre estas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">5. Actualizaciones</h2>
            <p>
              Esta política puede actualizarse periódicamente. Te notificaremos 
              sobre cambios significativos.
            </p>
          </section>

          <p className="pt-6 text-sm">
            Última actualización: Marzo 2026
          </p>
        </div>
      </div>
    </div>
  )
}
