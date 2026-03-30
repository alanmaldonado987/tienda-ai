export default function CareersPage() {
  const jobs = [
    {
      title: 'Asesor de Ventas Online',
      location: 'Remoto',
      type: 'Tiempo completo',
      description: 'Brindar atención al cliente y gestionar ventas online.'
    },
    {
      title: 'Analista de Marketing Digital',
      location: 'Bogotá',
      type: 'Tiempo completo',
      description: 'Gestionar campañas de marketing digital y redes sociales.'
    },
    {
      title: 'Diseñador Gráfico',
      location: 'Remoto',
      type: 'Freelance',
      description: 'Crear contenido visual para redes sociales y website.'
    },
    {
      title: 'Atención al Cliente',
      location: 'Bogotá',
      type: 'Tiempo parcial',
      description: 'Resolver consultas y problemas de clientes.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Trabaja con Nosotros</h1>
        <p className="text-gray-600 mb-12 max-w-2xl">
          Únete a nuestro equipo y sé parte de una empresa líder en moda. 
          Buscamos personas talentosas, apasionadas y con ganas de crecer.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job, index) => (
            <div key={index} className="border p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <div className="flex gap-4 text-sm text-gray-500 mb-3">
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.type}</span>
              </div>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <button className="bg-naf-black text-white px-6 py-2 hover:bg-naf-gray transition-colors">
                Aplicar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">¿No encuentras tu posición?</h2>
          <p className="text-gray-600 mb-4">
            Siempre estamos buscando talento. Envía tu CV a 
            <a href="mailto:rrhh@modacolombia.com" className="text-naf-black underline ml-1">
              rrhh@modacolombia.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
