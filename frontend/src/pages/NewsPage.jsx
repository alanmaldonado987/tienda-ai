export default function NewsPage() {
  const news = [
    {
      date: 'Marzo 2026',
      title: 'Nueva colección Primavera-Verano',
      description: 'Descubre las tendencias de la temporada con nuestra nueva colección.'
    },
    {
      date: 'Febrero 2026',
      title: '30% de descuento en Jeans',
      description: 'Celebra el mes del amor con ofertas incredibres en nuestra selección de jeans.'
    },
    {
      date: 'Enero 2026',
      title: 'Nueva app móvil',
      description: 'Ahora puedes comprar desde tu celular con nuestra nueva aplicación.'
    },
    {
      date: 'Diciembre 2025',
      title: 'Black Friday 2025',
      description: 'Las mejores ofertas del año te esperan. No te lo pierdas.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8">Noticias</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {news.map((item, index) => (
            <article key={index} className="border">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <span className="text-sm text-naf-gray">{item.date}</span>
                <h2 className="text-xl font-semibold mt-2 mb-3">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
