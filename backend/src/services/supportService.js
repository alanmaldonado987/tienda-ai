/**
 * Support Service - Lógica de negocio para soporte
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Cargar system prompt
const loadSystemPrompt = () => {
  const promptPath = path.join(__dirname, '../../system-prompt.md');
  try {
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.log('⚠️ No se encontró system-prompt.md, usando fallback');
    return `Eres Sofía, asistente virtual de MODACOLOMBIA, tienda de ropa en línea de Colombia.
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
};

// Inicializar Gemini
const initGemini = () => {
  const genAI = new GoogleGenerativeAI(config.geminiApiKey || process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

class SupportService {
  constructor() {
    this.systemPrompt = loadSystemPrompt();
    this.model = null;
  }

  /**
   * Obtener modelo de Gemini (lazy init)
   */
  getModel() {
    if (!this.model) {
      this.model = initGemini();
    }
    return this.model;
  }

  /**
   * Procesar mensaje del chat
   * @param {string} message - Mensaje del usuario
   * @param {string} sessionId - ID de sesión opcional
   * @returns {Promise<Object>}
   */
  async processChat(message, sessionId) {
    if (!message || message.trim().length === 0) {
      throw new Error('El mensaje no puede estar vacío');
    }

    try {
      const model = this.getModel();
      
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: this.systemPrompt }]
          }
        ]
      });

      const result = await chat.sendMessage(message);
      const response = result.response.text();

      return {
        response,
        suggestions: ['Envíos', 'Devoluciones', 'Métodos de pago', 'Contacto'],
        sessionId: sessionId || `session_${Date.now()}`
      };
    } catch (error) {
      console.error('Error en SupportService.processChat:', error.message);
      
      return {
        response: 'Lo siento, tengo problemas técnicos en este momento. Por favor intenta más tarde o contáctanos por WhatsApp: 300-XXX-XXXX',
        suggestions: ['Contacto', 'Ayuda'],
        sessionId: sessionId || `session_${Date.now()}`
      };
    }
  }

  /**
   * Obtener temas de ayuda disponibles
   * @returns {Array<Object>}
   */
  getTopics() {
    return [
      { id: 'envios', title: 'Envíos', icon: '📦' },
      { id: 'devoluciones', title: 'Devoluciones', icon: '🔄' },
      { id: 'pago', title: 'Métodos de pago', icon: '💳' },
      { id: 'tallas', title: 'Tallas', icon: '📏' },
      { id: 'pedidos', title: 'Mis pedidos', icon: '📋' },
      { id: 'contacto', title: 'Contacto', icon: '📞' }
    ];
  }

  /**
   * Guardar feedback del usuario
   * @param {Object} feedbackData - Datos del feedback
   * @returns {Promise<Object>}
   */
  async saveFeedback(feedbackData) {
    // Aquí podrías guardar en DB si fuera necesario
    return { success: true, message: '¡Gracias por tu feedback!' };
  }
}

module.exports = new SupportService();