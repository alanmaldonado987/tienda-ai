require('dotenv').config();

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Cargar system prompt desde archivo
let systemPrompt = '';
const promptPath = path.join(__dirname, '../../system-prompt.md');
try {
  systemPrompt = fs.readFileSync(promptPath, 'utf-8');
} catch (error) {
  console.log('⚠️ No se encontró system-prompt.md, usando fallback');
  systemPrompt = `Eres Sofía, asistente virtual de MODACOLOMBIA, tienda de ropa en línea de Colombia.
Información clave:
- Envío gratis pedidos mayores a $150.000
- Tiempo entrega: 3-5 días hábiles
- 5 días para devoluciones
- Métodos: tarjetas, transferencia, efectivo
- WhatsApp: 300-XXX-XXXX
- Email: atencion@modacolombia.com
- Horario: L-V 8am-6pm, Sábados 9am-5pm

Responde siempre en español, de manera amable y útil. Sé concisa y servicial.`;
}

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

    // Crear chat con el system prompt integrado
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        }
      ]
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
    console.error('Error en chat de soporte (Gemini):', error.message);
    
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