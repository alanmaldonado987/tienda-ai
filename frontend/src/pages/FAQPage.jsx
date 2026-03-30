import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      question: '¿Cómo realizo un pedido?',
      answer: 'Para realizar un pedido, simplemente navega por nuestra tienda, selecciona los productos que deseas comprar, agrégalos al carrito y proceed al checkout. Necesitarás proporcionar tu información de envío y pago.'
    },
    {
      question: '¿Cuáles son los métodos de pago?',
      answer: 'Aceptamos pagos con tarjetas de crédito y débito (Visa, Mastercard, American Express), pagos en efectivo mediante Efecty, y MercadoPago. También puedes pagar contra entrega en algunas zonas.'
    },
    {
      question: '¿Puedo cambiar o devolver un producto?',
      answer: 'Sí, tienes 5 días para cambios y devoluciones. El producto debe estar sin usar, con etiquetas originales y en su empaque original. Contáctanos para iniciar el proceso.'
    },
    {
      question: '¿Cuánto tiempo dura el envío?',
      answer: 'Los envíos normales toman 3-5 días hábiles. El envío express toma 1-2 días hábiles. Las entregas en Bogotá pueden ser el mismo día si ordenas antes del mediodía.'
    },
    {
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Recibirás un correo con el número de seguimiento una vez que tu pedido sea despachado. También puedes rastrear tu pedido desde la sección "Mis pedidos" en tu cuenta.'
    },
    {
      question: '¿Los precios incluyen IVA?',
      answer: 'Sí, todos nuestros precios incluyen IVA. Emitimos factura electrónica por cada compra.'
    },
    {
      question: '¿Puedo comprar sin registrarme?',
      answer: 'Sí, puedes comprar como invitado. Sin embargo, te recomendamos crear una cuenta para facilitar el seguimiento de tus pedidos y acceder a promociones exclusivas.'
    },
    {
      question: '¿Qué hago si mi producto llega dañado?',
      answer: 'Contáctanos inmediatamente con fotos del producto dañado y te enviaremos uno nuevo sin costo adicional o procesaremos el reembolso.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8">Preguntas Frecuentes</h1>

        <div className="max-w-3xl">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full py-5 flex items-center justify-between text-left"
              >
                <span className="font-medium text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-naf-gray" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-naf-gray" />
                )}
              </button>
              {openIndex === index && (
                <div className="pb-5 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">¿No encontraste lo que buscabas?</h2>
          <p className="text-gray-600 mb-4">
            Contáctanos por WhatsApp o escríbenos a 
            <a href="mailto:soporte@modacolombia.com" className="text-naf-black underline ml-1">
              soporte@modacolombia.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
