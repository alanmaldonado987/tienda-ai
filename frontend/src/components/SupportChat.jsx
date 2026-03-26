import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react';

// Respuestas del bot
const botResponses = {
  'hola': '¡Hola! 👋 Soy el asistente virtual de MODACOLOMBIA. ¿En qué puedo ayudarte hoy?',
  'hola!': '¡Hola! 👋 Soy el asistente virtual de MODACOLOMBIA. ¿En qué puedo ayudarte hoy?',
  'buenos días': '¡Buenos días! ☀️ ¿En qué puedo ayudarte?',
  'buenas': '¡Buenas! 👋 ¿En qué puedo ayudarte?',
  'envío': '📦 **Información de envíos:**\n\n• Envío gratis en pedidos mayores a $150.000\n• Tiempo de entrega: 3-5 días hábiles\n• Envío a todo Colombia\n\n¿Necesitas más información?',
  'envios': '📦 **Información de envíos:**\n\n• Envío gratis en pedidos mayores a $150.000\n• Tiempo de entrega: 3-5 días hábiles\n• Envío a todo Colombia\n\n¿Necesitas más información?',
  'delivery': '📦 **Información de envíos:**\n\n• Envío gratis en pedidos mayores a $150.000\n• Tiempo de entrega: 3-5 días hábiles\n• Envío a todo Colombia\n\n¿Necesitas más información?',
  'devolución': '🔄 **Política de devoluciones:**\n\n• Tienes 5 días para cambios y devoluciones\n• El producto debe estar en perfecto estado\n•Puedes hacer la devolución en tienda o contactarnos\n\n¿Necesitas ayuda con algo más?',
  'devoluciones': '🔄 **Política de devoluciones:**\n\n• Tienes 5 días para cambios y devoluciones\n• El producto debe estar en perfecto estado\n• Puedes hacer la devolución en tienda o contactarnos\n\n¿Necesitas ayuda con algo más?',
  'cambio': '🔄 **Política de cambios:**\n\n• Tienes 5 días para cambios\n• El producto debe tener las etiquetas originales\n• Trae el comprobante de compra\n\n¿Necesitas más información?',
  'talla': '📏 **Guía de tallas:**\n\nEn cada producto encontrarás nuestra guía de tallas. Si tienes dudas, puedo ayudarte a elegir. ¿Qué producto te interesa?',
  'tallas': '📏 **Guía de tallas:**\n\nEn cada producto encontrarás nuestra guía de tallas. Si tienes dudas, puedo ayudarte a elegir. ¿Qué producto te interesa?',
  'tamaño': '📏 **Guía de tallas:**\n\nEn cada producto encontrarás nuestra guía de tallas. Si tienes dudas, puedo ayudarte a elegir. ¿Qué producto te interesa?',
  'precio': '💰 **Precios:**\n\nNuestros precios ya incluyen IVA. Puedes filtrar por rango de precio en la tienda. ¿Hay algo específico que buscas?',
  'precios': '💰 **Precios:**\n\nNuestros precios ya incluyen IVA. Puedes filtrar por rango de precio en la tienda. ¿Hay algo específico que buscas?',
  'pago': '💳 **Métodos de pago:**\n\n• Tarjetas de crédito y débito\n• Transferencia bancaria\n• Efectivo en puntos de venta\n\n¿Necesitas más información?',
  'pagos': '💳 **Métodos de pago:**\n\n• Tarjetas de crédito y débito\n• Transferencia bancaria\n• Efectivo en puntos de venta\n\n¿Necesitas más información?',
  'tarjeta': '💳 **Métodos de pago:**\n\n• Tarjetas de crédito y débito (Visa, Mastercard, American Express)\n• Transferencia bancaria\n\n¿Necesitas más información?',
  'contacto': '📞 **Contacto:**\n\n• WhatsApp: [número]\n• Email: atencion@modacolombia.com\n• Horario: L-V 8am-6pm\n\n¿Necesitas algo más?',
  'contactar': '📞 **Contacto:**\n\n• WhatsApp: [número]\n• Email: atencion@modacolombia.com\n• Horario: L-V 8am-6pm\n\n¿Necesitas algo más?',
  'whatsapp': '📱 **WhatsApp:**\n\nEscribenos por WhatsApp para atención más rápida. ¡Estamos para ayudarte!\n\n¿Necesitas algo más?',
  'gracias': '😊 **¡De nada!** Si tienes más preguntas, no dudes en escribirnos. ¡Gracias por contactingarnos!',
  'gracias!': '😊 **¡De nada!** Si tienes más preguntas, no dudes en escribirnos. ¡Gracias por contactarnos!',
  'adiós': '👋 **¡Hasta pronto!**\n\nGracias por contactarnos. ¡Vuelve cuando quieras!',
  'adios': '👋 **¡Hasta pronto!**\n\nGracias por contactarnos. ¡Vuelve cuando quieras!',
  'ayuda': '🤝 **¿En qué puedo ayudarte?**\n\nPuedo informarte sobre:\n• Envíos y entregas\n• Devoluciones y cambios\n• Tallas y colores disponibles\n• Métodos de pago\n• Estado de tu pedido\n\nSolo escríbeme tu pregunta.',
  'pedido': '📋 **Estado de pedido:**\n\nPara consultar el estado de tu pedido, inicia sesión y ve a "Mis pedidos" en tu perfil. ¿Tienes alguna otra pregunta?',
  'pedidos': '📋 **Estado de pedido:**\n\nPara consultar el estado de tu pedido, inicia sesión y ve a "Mis pedidos" en tu perfil. ¿Tienes alguna otra pregunta?',
  'carrito': '🛒 **Carrito:**\n\nPuedes agregar productos y ver tu carrito haciendo clic en el ícono de la bolsa en el header. ¿Necesitas algo más?',
  'comprar': '🛍️ **¿Cómo comprar?**\n\n1. Elige tus productos\n2. Agrega al carrito\n3. Selecciona método de envío\n4. Elige método de pago\n5. Confirma tu pedido\n\n¿Necesitas más ayuda?',
  'cómo comprar': '🛍️ **¿Cómo comprar?**\n\n1. Elige tus productos\n2. Agrega al carrito\n3. Selecciona método de envío\n4. Elige método de pago\n5. Confirma tu pedido\n\n¿Necesitas más ayuda?',
  'stock': '📦 **Disponibilidad:**\n\nLos productos con disponibilidad se muestran en la tienda. Si un producto está agotado, no podrás agregarlo al carrito. ¿Buscas algo específico?',
  'agotado': '📦 **Productos agotados:**\n\nLamentablemente ese producto está agotado. Puedes buscar alternativas similares o escribirnos para notifyte cuando vuelva a estar disponible. ¿Necesitas algo más?',
  'descuento': '🏷️ **Descuentos y ofertas:**\n\nVisita nuestra sección "Sale" para ver productos con descuento. ¡Siempre hay buenas ofertas! 🔥',
  'ofertas': '🏷️ **Ofertas:**\n\nVisita nuestra sección "Sale" para ver productos con descuento. ¡Siempre hay buenas ofertas! 🔥',
  'sale': '🔥 **Sale:**\n\nVisita nuestra sección "Sale" para ver productos con descuento. ¡No te pierdas nuestras ofertas!',
};

// Mensaje por defecto cuando no entiende
const defaultResponse = '🤔 No estoy seguro de entender tu pregunta. Puedo ayudarte con:\n\n• Envíos y entregas\n• Devoluciones y cambios\n• Tallas y colores\n• Métodos de pago\n• Estado de tu pedido\n\nIntenta ser más específico o escribe "ayuda" para ver todas las opciones.';

const findResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Buscar palabras clave en las respuestas
  for (const [key, response] of Object.entries(botResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return defaultResponse;
};

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: '¡Hola! 👋 Soy el asistente de MODACOLOMBIA. ¿En qué puedo ayudarte?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular delay del bot
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: findResponse(inputText)
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-naf-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40 ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-naf-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Asistente Virtual</h3>
                <p className="text-xs text-white/70">En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    msg.type === 'user'
                      ? 'bg-naf-black text-white rounded-br-md'
                      : 'bg-naf-light-gray text-naf-black rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-naf-light-gray p-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-naf-black"
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className="w-10 h-10 bg-naf-black text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-naf-gray transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}