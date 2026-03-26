/**
 * Rutas de soporte
 */
const express = require('express');
const router = express.Router();
const supportService = require('../services/supportService');

/**
 * POST /api/support/chat - Chat con el bot de soporte (Gemini AI)
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const result = await supportService.processChat(message, sessionId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/support/topics - Obtener temas de ayuda
 */
router.get('/topics', async (req, res) => {
  try {
    const topics = supportService.getTopics();
    
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
    const result = await supportService.saveFeedback(req.body);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al enviar feedback'
    });
  }
});

module.exports = router;