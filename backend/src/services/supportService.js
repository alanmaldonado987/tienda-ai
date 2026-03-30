/**
 * Support Service - Lógica de negocio para soporte
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const loadSystemPrompt = () => {
  const promptPath = path.join(__dirname, '../../system-prompt.md');
  try {
    return fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
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
      { 
        id: 'envios', 
        title: 'Envíos', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>'
      },
      { 
        id: 'devoluciones', 
        title: 'Devoluciones', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>'
      },
      { 
        id: 'pago', 
        title: 'Métodos de pago', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>'
      },
      { 
        id: 'tallas', 
        title: 'Tallas', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"></path><path d="m14.5 12.5 2-2"></path><path d="m11.5 9.5 2-2"></path><path d="m8.5 6.5 2-2"></path><path d="m17.5 15.5 2-2"></path></svg>'
      },
      { 
        id: 'pedidos', 
        title: 'Mis pedidos', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
      },
      { 
        id: 'contacto', 
        title: 'Contacto', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>'
      }
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