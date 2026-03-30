import { Leaf, Recycle, Heart, Globe } from 'lucide-react'

export default function SustainabilityPage() {
  const initiatives = [
    {
      icon: Leaf,
      title: 'Materiales Sostenibles',
      description: 'Priorizamos productos hechos con materiales reciclados y sostenibles.'
    },
    {
      icon: Recycle,
      title: 'Economía Circular',
      description: 'Promovemos la reutilización y reciclaje de prendas.'
    },
    {
      icon: Heart,
      title: 'Comunidad',
      description: 'Apoyamos a comunidades locales de artesanos colombianos.'
    },
    {
      icon: Globe,
      title: 'Carbono Neutral',
      description: 'Compensamos las emisiones deCO2 de todos nuestros envíos.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Sostenibilidad</h1>
        <p className="text-gray-600 mb-12 max-w-2xl">
          En MODACOLOMBIA creemos en la moda responsable. Nos comprometemos 
          a reducir nuestro impacto ambiental y promover prácticas sostenibles.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {initiatives.map((item, index) => (
            <div key={index} className="flex gap-4 p-6 bg-gray-50">
              <div className="w-12 h-12 bg-naf-black text-white flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Nuestro Compromiso</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Para 2030, nos comprometemos a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reducir nuestro consumo de energía en un 50%</li>
              <li>Usar 100% materiales reciclados o sostenibles</li>
              <li>Eliminar plásticos de un solo uso en nuestros empaques</li>
              <li>Supporting textile recycling programs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
