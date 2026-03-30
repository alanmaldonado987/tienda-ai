const express = require('express');
const router = express.Router();
const SystemConfig = require('../models/SystemConfig');
const { auth } = require('../middleware/auth');

/**
 * Rutas de configuración del sistema
 * GET /api/config - Obtener toda la configuración
 * GET /api/config/:key - Obtener valor por key
 * PUT /api/config - Actualizar configuración
 */

// Obtener toda la configuración
router.get('/', async (req, res) => {
  try {
    const config = await SystemConfig.getAll();
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Obtener valor por key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = await SystemConfig.getValue(key);
    res.json({
      success: true,
      data: { key, value }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Actualizar configuración
router.put('/', auth, async (req, res) => {
  try {
    const configData = req.body;
    
    for (const [key, value] of Object.entries(configData)) {
      await SystemConfig.setValue(key, value);
    }
    
    const updatedConfig = await SystemConfig.getAll();
    
    res.json({
      success: true,
      message: 'Configuración actualizada',
      data: updatedConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
