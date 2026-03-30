import { RefreshCw, Package, CreditCard, AlertCircle } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8">Cambios y Devoluciones</h1>

        <div className="max-w-3xl space-y-8">
          <div className="bg-green-50 p-6 border border-green-200">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <RefreshCw className="w-6 h-6" />
              Política de Cambios
            </h2>
            <p className="text-gray-700">
              Tienes <strong>5 días</strong> para realizar cambios desde la fecha de entrega. 
              El producto debe estar en perfecto estado, sin usar, con etiquetas originales.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">¿Cómo hacer un cambio?</h2>
            <ol className="list-decimal pl-6 space-y-4 text-gray-600">
              <li>
                <strong>Contáctanos</strong> - Escríbenos a 
                <a href="mailto:soporte@modacolombia.com" className="text-naf-black underline ml-1">
                  soporte@modacolombia.com
                </a> o por WhatsApp indicando tu número de pedido.
              </li>
              <li>
                <strong>Envíanos el producto</strong> - Te enviamos una etiqueta de retorno sin costo o coordinamos la recolección.
              </li>
              <li>
                <strong>Recibe tu cambio</strong> - Una vez recibido, procesamos tu cambio y te enviamos el nuevo producto.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">¿Cómo hacer una devolución?</h2>
            <ol className="list-decimal pl-6 space-y-4 text-gray-600">
              <li>
                <strong>Contáctanos</strong> - Indícanos tu número de pedido y razón de la devolución.
              </li>
              <li>
                <strong>Envía el producto</strong> - Usa el mismo empaque o uno similar. No necesitamos que esté en caja original.
              </li>
              <li>
                <strong>Recibe tu reembolso</strong> - Procesamos el reembolso en 5-7 días hábiles después de recibir el producto.
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Reembolsos
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• El reembolso se hace al mismo método de pago usado</li>
              <li>• Tarjetas: 5-10 días hábiles</li>
              <li>• Efecty/Contraentrega: 3-5 días hábiles</li>
              <li>• El costo de envío no es reembolsable (excepto por defectos)</li>
            </ul>
          </div>

          <div className="bg-red-50 p-6 border border-red-200">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              No aplica para:
            </h2>
            <ul className="text-gray-700 space-y-1">
              <li>• Ropa interior, bikinis,joyería</li>
              <li>• Productos en oferta o promoción (solo cambio)</li>
              <li>• Productos personalizados</li>
              <li>• Prendas con signos de uso</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
