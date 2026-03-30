export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8">Política de Privacidad</h1>

        <div className="max-w-3xl space-y-6 text-gray-600">
          <p>
            En MODACOLOMBIA respetamos tu privacidad y estamos comprometidos a 
            proteger tus datos personales. Esta política explica cómo recopilamos 
            y usamos tu información.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">1. Información que Recopilamos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Información de cuenta (nombre, email, teléfono)</li>
              <li>Historial de compras</li>
              <li>Información de pago (de manera segura)</li>
              <li>Dirección de envío y facturación</li>
              <li>Cookies y datos de navegación</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">2. Cómo Usamos tu Información</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Procesar tus pedidos y entregas</li>
              <li>Personalizar tu experiencia de compra</li>
              <li>Enviar comunicaciones sobre ofertas y promociones</li>
              <li>Mejorar nuestros servicios</li>
              <li>Cumplir obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">3. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para 
              proteger tus datos contra accesos no autorizados, pérdida o manipulación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">4. Compartir Información</h2>
            <p>
              No vendemos tus datos personales. Solo compartimos información con 
              proveedores de servicios necesarios para completar tus pedidos (envíos, pagos).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">5. Tus Derechos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar información incorrecta</li>
              <li>Solicitar eliminación de tus datos</li>
              <li>Opt-out de comunicaciones de marketing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-naf-black mb-3">6. Contacto</h2>
            <p>
              Para ejercer tus derechos o consultas sobre esta política, 
              contáctanos en: 
              <a href="mailto:privacidad@modacolombia.com" className="text-naf-black underline ml-1">
                privacidad@modacolombia.com
              </a>
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
