import { Truck, Package, MapPin, Clock, DollarSign } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8">Envíos y Entregas</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-gray-50">
            <Truck className="w-10 h-10 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Envío Estándar</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• 3-5 días hábiles</li>
              <li>• Costo: $9.900</li>
              <li>• Gratis en pedidos mayores a $150.000</li>
              <li>• Available en todo Colombia</li>
            </ul>
          </div>

          <div className="p-6 bg-gray-50">
            <Clock className="w-10 h-10 mb-4" />
            <h2 className="text-xl font-semibold mb-3">Envío Express</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• 1-2 días hábiles</li>
              <li>• Costo: $19.900</li>
              <li>• Disponible en ciudades principales</li>
              <li>• Pedidos antes del mediodía</li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Zonas de Entrega</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold">Bogotá</h3>
                <p className="text-gray-600">Entrega el mismo día en pedidos antes del mediodía. Costo: $5.900</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold">Ciudades principales</h3>
                <p className="text-gray-600">Medellín, Cali, Barranquilla, Bucaramanga. Entrega 1-3 días.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 mt-1" />
              <div>
                <h3 className="font-semibold">Resto del país</h3>
                <p className="text-gray-600">3-7 días hábiles. Servicio de mensajería.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Información Importante</h2>
          <ul className="space-y-3 text-gray-600">
            <li>• Los pedidos se procesan de lunes a viernes (no festivos)</li>
            <li>• Recibirás un SMS cuando tu pedido esté en camino</li>
            <li>• Puedes rastrear tu pedido con el número de seguimiento</li>
            <li>• Se requieren 2 intentos de entrega. Si no hay nadie, contactaremos para coordinar</li>
            <li>• Para envíos a zonas rurales, puede haber demora adicional</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
