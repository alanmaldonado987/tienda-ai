require('dotenv').config();

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializar Gemini con la API key del usuario
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

// Contexto del asistente
const systemPrompt = `
Eres el asistente virtual de MODACOLOMBIA, una tienda de ropa en línea de Colombia.

Información importante:
- Envío gratis en pedidos mayores a $150.000
- Tiempo de entrega: 3-5 días hábiles a todo Colombia
- Tienes 5 días para cambios y devoluciones
- Métodos de pago: Tarjetas de crédito/débito, transferencia, efectivo en puntos de pago
- Horario de atención: Lunes a Viernes 8am-6pm, Sábados 9am-5pm
- WhatsApp: 300-XXX-XXXX
- Email: atencion@modacolombia.com

Tu rol es:
1. Ayudar a clientes con preguntas sobre productos, envíos, devoluciones, pagos
2. Ser amable, profesional y conciso
3. Dar respuestas breves y útiles
4. Si no sabes algo, admitirlo y ofrecer ayudar de otra forma

Responde siempre en español y de manera útil.
`;

/**
 * POST /api/support/chat - Chat con el bot de soporte (Gemini AI)
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

    // Crear chat con contexto
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Soy el asistente virtual de MODACOLOMBIA. ¿En qué puedo ayudarte hoy?' }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    // Enviar mensaje y obtener respuesta
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    res.json({
      success: true,
      data: {
        response: response,
        suggestions: ['Envíos', 'Devoluciones', 'Métodos de pago', 'Contacto'],
        sessionId: sessionId || `session_${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error en chat de soporte (Gemini):', error);
    
    // Si falla Gemini, responder con mensaje de error amigable
    res.json({
      success: true,
      data: {
        response: 'Lo siento, tengo problemas técnicos en este momento. Por favor intenta más tarde o contáctanos por WhatsApp: 300-XXX-XXXX',
        suggestions: ['Contacto', 'Ayuda'],
        sessionId: req.body.sessionId || `session_${Date.now()}`
      }
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
    
    res.json({
      success: true,
      message: '¡Gracias por tu feedback!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al enviar feedback'
    });
  }
});

module.exports = router;