const express = require('express');
const router = express.Router();

// Base de conocimientos del bot - respuestas predefinidas
const knowledgeBase = {
  'hola': {
    response: '¡Hola! 👋 Soy el asistente virtual de MODACOLOMBIA. ¿En qué puedo ayudarte hoy?',
    suggestions: ['Envíos', 'Devoluciones', 'Métodos de pago']
  },
  'hola!': {
    response: '¡Hola! 👋 Soy el asistente virtual de MODACOLOMBIA. ¿En qué puedo ayudarte hoy?',
    suggestions: ['Envíos', 'Devoluciones', 'Métodos de pago']
  },
  'buenos días': {
    response: '¡Buenos días! ☀️ ¿En qué puedo ayudarte?',
    suggestions: ['Envíos', 'Devoluciones', 'Tallas']
  },
  'buenas': {
    response: '¡Buenas! 👋 ¿En qué puedo ayudarte?',
    suggestions: ['Envíos', 'Devoluciones', 'Métodos de pago']
  },
  'envío': {
    response: '📦 *Información de envíos:*\n\n• Envío gratis en pedidos mayores a $150.000\n• Tiempo de entrega: 3-5 días hábiles\n• Envío a todo Colombia\n• Seguimiento en tiempo real',
    suggestions: ['Costos de envío', 'Tiempo de entrega', 'Devoluciones']
  },
  'envios': {
    response: '📦 *Información de envíos:*\n\n• Envío gratis en pedidos mayores a $150.000\n• Tiempo de entrega: 3-5 días hábiles\n• Envío a todo Colombia\n• Seguimiento en tiempo real',
    suggestions: ['Costos de envío', 'Tiempo de entrega', 'Devoluciones']
  },
  'delivery': {
    response: '📦 *Información de envíos:*\n\n• Envío gratis en pedidos mayores a $150.000\n• Tiempo de entrega: 3-5 días hábiles\n• Envío a todo Colombia\n• Seguimiento en tiempo real',
    suggestions: ['Costos de envío', 'Tiempo de entrega', 'Devoluciones']
  },
  'devolución': {
    response: '🔄 *Política de devoluciones:*\n\n• Tienes 5 días para cambios y devoluciones\n• El producto debe estar en perfecto estado\n• Puedes hacer la devolución en tienda o contactarnos\n• El reembolso se hace en 5-7 días hábiles',
    suggestions: ['Cómo cambiar', 'Tiempo de reembolso', 'Condiciones']
  },
  'devoluciones': {
    response: '🔄 *Política de devoluciones:*\n\n• Tienes 5 días para cambios y devoluciones\n• El producto debe estar en perfecto estado\n• Puedes hacer la devolución en tienda o contactarnos\n• El reembolso se hace en 5-7 días hábiles',
    suggestions: ['Cómo cambiar', 'Tiempo de reembolso', 'Condiciones']
  },
  'cambio': {
    response: '🔄 *Política de cambios:*\n\n• Tienes 5 días para cambios\n• El producto debe tener las etiquetas originales\n• Trae el comprobante de compra\n• Puedes cambiar en cualquier tienda física',
    suggestions: ['Devoluciones', 'Tiempo límite', 'Condiciones']
  },
  'talla': {
    response: '📏 *Guía de tallas:*\n\nEn cada producto encontrarás nuestra guía de tallas. Si tienes dudas sobre tu talla, puedo ayudarte. ¿Qué tipo de producto buscas?',
    suggestions: ['Guía completa', 'Cómo medirme', 'Recomendaciones']
  },
  'tallas': {
    response: '📏 *Guía de tallas:*\n\nEn cada producto encontrarás nuestra guía de tallas. Si tienes dudas sobre tu talla, puedo ayudarte. ¿Qué tipo de producto buscas?',
    suggestions: ['Guía completa', 'Cómo medirme', 'Recomendaciones']
  },
  'tamaño': {
    response: '📏 *Guía de tallas:*\n\nEn cada producto encontrarás nuestra guía de tallas. Si tienes dudas sobre tu talla, puedo ayudarte. ¿Qué tipo de producto buscas?',
    suggestions: ['Guía completa', 'Cómo medirme', 'Recomendaciones']
  },
  'precio': {
    response: '💰 *Precios:*\n\nNuestros precios ya incluyen IVA. Puedes filtrar por rango de precio en la tienda. ¿Hay algo específico que buscas?',
    suggestions: ['Ofertas', 'Métodos de pago', 'Descuentos']
  },
  'precios': {
    response: '💰 *Precios:*\n\nNuestros precios ya incluyen IVA. Puedes filtrar por rango de precio en la tienda. ¿Hay algo específico que buscas?',
    suggestions: ['Ofertas', 'Métodos de pago', 'Descuentos']
  },
  'pago': {
    response: '💳 *Métodos de pago:*\n\n• Tarjetas de crédito y débito (Visa, Mastercard, American Express)\n• Transferencia bancaria\n• Efectivo en puntos de pago\n• Cuotas sin intereses con algunos bancos',
    suggestions: ['Tarjetas', 'Transferencia', 'Cuotas']
  },
  'pagos': {
    response: '💳 *Métodos de pago:*\n\n• Tarjetas de crédito y débito (Visa, Mastercard, American Express)\n• Transferencia bancaria\n• Efectivo en puntos de pago\n• Cuotas sin intereses con algunos bancos',
    suggestions: ['Tarjetas', 'Transferencia', 'Cuotas']
  },
  'tarjeta': {
    response: '💳 *Tarjetas aceptadas:*\n\n• Visa\n• Mastercard\n• American Express\n• Tarjetas débito\n\n Todas con seguridad SSL.',
    suggestions: ['Cuotas', 'Promociones', 'Seguridad']
  },
  'contacto': {
    response: '📞 *Contacto:*\n\n• WhatsApp: 300-XXX-XXXX\n• Email: atencion@modacolombia.com\n• Horario: Lunes a Viernes 8am-6pm\n• Sábados 9am-5pm',
    suggestions: ['WhatsApp', 'Email', 'Horario']
  },
  'contactar': {
    response: '📞 *Contacto:*\n\n• WhatsApp: 300-XXX-XXXX\n• Email: atencion@modacolombia.com\n• Horario: Lunes a Viernes 8am-6pm\n• Sábados 9am-5pm',
    suggestions: ['WhatsApp', 'Email', 'Horario']
  },
  'whatsapp': {
    response: '📱 *WhatsApp:*\n\nEscríbenos al 300-XXX-XXXX para atención más rápida. ¡Estamos para ayudarte!',
    suggestions: ['Horario', 'Contacto', 'Email']
  },
  'gracias': {
    response: '😊 *¡De nada!* Si tienes más preguntas, no dudes en escribirnos. ¡Gracias por contactarnos!',
    suggestions: ['Ayuda', 'Tienda', 'Ofertas']
  },
  'gracias!': {
    response: '😊 *¡De nada!* Si tienes más preguntas, no dudes en escribirnos. ¡Gracias por contactarnos!',
    suggestions: ['Ayuda', 'Tienda', 'Ofertas']
  },
  'adiós': {
    response: '👋 *¡Hasta pronto!* Gracias por contactarnos. ¡Vuelve cuando quieras!',
    suggestions: []
  },
  'adios': {
    response: '👋 *¡Hasta pronto!* Gracias por contactarnos. ¡Vuelve cuando quieras!',
    suggestions: []
  },
  'ayuda': {
    response: '🤝 *¿En qué puedo ayudarte?* \n\nPuedo informarte sobre:\n• Envíos y entregas\n• Devoluciones y cambios\n• Tallas y colores disponibles\n• Métodos de pago\n• Estado de tu pedido\n\nSolo escríbeme tu pregunta.',
    suggestions: ['Envíos', 'Devoluciones', 'Pago']
  },
  'pedido': {
    response: '📋 *Estado de pedido:*\n\nPara consultar el estado de tu pedido:\n1. Inicia sesión\n2. Ve a "Mis pedidos" en tu perfil\n3. Allí verás el estado y seguimiento',
    suggestions: ['Cómo comprar', 'Carrito', 'Ayuda']
  },
  'pedidos': {
    response: '📋 *Estado de pedido:*\n\nPara consultar el estado de tu pedido:\n1. Inicia sesión\n2. Ve a "Mis pedidos" en tu perfil\n3. Allí verás el estado y seguimiento',
    suggestions: ['Cómo comprar', 'Carrito', 'Ayuda']
  },
  'carrito': {
    response: '🛒 *Carrito:*\n\nPuedes agregar productos y ver tu carrito haciendo clic en el ícono de la bolsa en el header. También puedes guardar productos en favoritos.',
    suggestions: ['Cómo comprar', 'Favoritos', 'Pago']
  },
  'comprar': {
    response: '🛍️ *¿Cómo comprar?*\n\n1. Elige tus productos\n2. Agrega al carrito\n3. Selecciona método de envío\n4. Elige método de pago\n5. Confirma tu pedido\n\n¡Es fácil!',
    suggestions: ['Carrito', 'Envío', 'Pago']
  },
  'cómo comprar': {
    response: '🛍️ *¿Cómo comprar?*\n\n1. Elige tus productos\n2. Agrega al carrito\n3. Selecciona método de envío\n4. Elige método de pago\n5. Confirma tu pedido\n\n¡Es fácil!',
    suggestions: ['Carrito', 'Envío', 'Pago']
  },
  'stock': {
    response: '📦 *Disponibilidad:*\n\nLos productos con disponibilidad se muestran en la tienda. Si un producto está agotado, no podrás agregarlo al carrito. ¿Buscas algo específico?',
    suggestions: ['Agotado', 'Notify', 'Alternativas']
  },
  'agotado': {
    response: '📦 *Productos agotados:*\n\nLamentablemente ese producto está agotado. Puedes buscar alternativas similares o escribirnos para notifyte cuando vuelva a estar disponible.',
    suggestions: ['Stock', 'Alternativas', 'Notify']
  },
  'descuento': {
    response: '🏷️ *Descuentos y ofertas:*\n\nVisita nuestra sección "Sale" para ver productos con descuento. ¡Siempre hay buenas ofertas! 🔥',
    suggestions: ['Sale', 'Ofertas', 'Newsletter']
  },
  'ofertas': {
    response: '🔥 *Ofertas:*\n\nVisita nuestra sección "Sale" para ver productos con descuento. ¡No te pierdas nuestras ofertas!',
    suggestions: ['Sale', 'Descuentos', 'Newsletter']
  },
  'sale': {
    response: '🔥 *Sale:*\n\nVisita nuestra sección "Sale" para ver productos con descuento. ¡No te pierdas nuestras ofertas!',
    suggestions: ['Ofertas', 'Descuentos', 'Newsletter']
  },
  ' newsletter': {
    response: '📰 *Newsletter:*\n\n¡Suscríbete para recibir ofertas exclusivas! Escribe tu email y te mandaremos las mejores promociones.',
    suggestions: ['Ofertas', 'Sale', 'Novedades']
  },
  'favoritos': {
    response: '❤️ *Favoritos:*\n\nGuarda tus productos favoritos haciendo clic en el corazón. Los encontrarás en tu lista de deseos.',
    suggestions: ['Carrito', 'Perfil', 'Ayuda']
  }
};

// Respuesta por defecto
const defaultResponse = {
  response: '🤔 No estoy seguro de entender tu pregunta. Puedo ayudarte con:\n\n• *Envíos y entregas*\n• *Devoluciones y cambios*\n• *Tallas y colores*\n• *Métodos de pago*\n• *Estado de tu pedido*\n\nIntenta ser más específico o escribe "ayuda" para ver todas las opciones.',
  suggestions: ['Envíos', 'Devoluciones', 'Pago', 'Ayuda']
};

// Encontrar respuesta basada en palabras clave
const findResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Buscar coincidencia exacta o parcial
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (lowerMessage.includes(key)) {
      return data;
    }
  }
  
  return defaultResponse;
};

/**
 * POST /api/support/chat - Chat con el bot de soporte
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje no puede estar vacío'
      });
    }

    // Obtener respuesta del bot
    const botResponse = findResponse(message.trim());
    
    // Simular delay para parece más natural (opcional)
    // await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    res.json({
      success: true,
      data: {
        response: botResponse.response,
        suggestions: botResponse.suggestions,
        sessionId: sessionId || `session_${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error en chat de soporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar tu mensaje'
    });
  }
});

/**
 * GET /api/support/topics - Obtener temas de ayuda
 */
router.get('/topics', async (req, res) => {
  try {
    const topics = [
      { id: 'envios', title: 'Envíos', icon: '📦' },
      { id: 'devoluciones', title: 'Devoluciones', icon: '🔄' },
      { id: 'pago', title: 'Métodos de pago', icon: '💳' },
      { id: 'tallas', title: 'Tallas', icon: '📏' },
      { id: 'pedidos', title: 'Mis pedidos', icon: '📋' },
      { id: 'contacto', title: 'Contacto', icon: '📞' }
    ];
    
    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener temas'
    });
  }
});

/**
 * POST /api/support/feedback - Enviar feedback
 */
router.post('/feedback', async (req, res) => {
  try {
    const { messageId, rating, comment } = req.body;
    
    // Aquí podrías guardar el feedback en la base de datos
    // Por ahora solo confirmamos recepción
    
    res.json({
      success: true,
      message: 'Gracias por tu feedback!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al enviar feedback'
    });
  }
});

module.exports = router;