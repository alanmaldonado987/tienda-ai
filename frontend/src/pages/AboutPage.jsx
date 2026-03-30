import { MapPin, Phone, Mail } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8">Quiénes Somos</h1>
        
        <div className="max-w-3xl space-y-6 text-gray-600">
          <p className="text-lg">
            Bienvenido a <strong>MODACOLOMBIA</strong>, tu destino número uno para la moda contemporánea en Colombia. 
            Desde nuestra fundación, nos hemos comprometido a ofrecer las mejores tendencias en ropa, zapatos y accesorios 
            para toda la familia.
          </p>
          
          <p>
            Nuestra historia comienza con una visión simple: hacer que la moda de calidad sea accesible para todos. 
            Hoy, continuamos cumpliendo ese sueño con una colección cuidadosamente seleccionada que combina estilo, 
            comodidad y precios justos.
          </p>

          <h2 className="text-xl font-semibold text-naf-black mt-8">Nuestra Misión</h2>
          <p>
            Brindar a nuestros clientes una experiencia de compra excepcional, ofreciendo productos de moda 
            de alta calidad que reflejen las últimas tendencias, todo con un servicio al cliente innovador.
          </p>

          <h2 className="text-xl font-semibold text-naf-black mt-8">Nuestra Visión</h2>
          <p>
            Ser la tienda de moda online líder en Colombia, reconocida por nuestra calidad, 
            innovación y compromiso con la satisfacción del cliente.
          </p>

          <h2 className="text-xl font-semibold text-naf-black mt-8">Contáctanos</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-naf-gray" />
              <span>Bogotá, Colombia</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-naf-gray" />
              <span>+57 300 123 4567</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-naf-gray" />
              <span>contacto@modacolombia.com</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <a href="#" className="w-10 h-10 bg-naf-black text-white flex items-center justify-center hover:bg-naf-gray transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-naf-black text-white flex items-center justify-center hover:bg-naf-gray transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 bg-naf-black text-white flex items-center justify-center hover:bg-naf-gray transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
