const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de Órdenes
 * Todas las rutas (excepto admin) requieren autenticación
 */

// POST /api/orders - Crear orden desde carrito
router.post('/', auth, orderController.createOrder);

// GET /api/orders - Obtener historial de órdenes del usuario
router.get('/', auth, orderController.getOrders);

// GET /api/orders/:id - Obtener orden por ID
router.get('/:id', auth, orderController.getOrder);

// DELETE /api/orders/:id - Cancelar orden
router.delete('/:id', auth, orderController.cancelOrder);

// GET /api/orders/admin/all - Obtener todas las órdenes (admin)
router.get('/admin/all', auth, orderController.getAllOrders);

// PUT /api/orders/admin/:id/status - Actualizar estado (admin)
router.put('/admin/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;
