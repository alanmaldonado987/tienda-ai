const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de Inventario (admin)
 * GET /api/inventory - Obtener todos los productos con stock
 * GET /api/inventory/low-stock - Obtener productos con stock bajo
 * GET /api/inventory/:id - Obtener inventario de producto
 * PUT /api/inventory/:id - Actualizar stock de producto
 * POST /api/inventory/:id/adjust - Ajustar stock (incremento/decremento)
 */

// Rutas de admin
router.get('/', auth, productController.getInventory);
router.get('/low-stock', auth, productController.getLowStockProducts);
router.get('/:id', auth, productController.getProductInventory);
router.put('/:id', auth, productController.updateInventory);
router.post('/:id/adjust', auth, productController.adjustStock);

module.exports = router;
