const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

/**
 * Rutas del Dashboard (admin)
 * GET /api/dashboard/stats - Obtener estadísticas
 * GET /api/dashboard/sales-chart - Obtener gráfica de ventas
 */

router.get('/stats', auth, dashboardController.getStats);
router.get('/sales-chart', auth, dashboardController.getSalesChart);

module.exports = router;
