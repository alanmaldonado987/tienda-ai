const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de Carrito
 * Todas las rutas requieren autenticación
 */

// GET /api/cart - Obtener carrito del usuario
router.get('/', auth, cartController.getCart);

// POST /api/cart - Agregar item al carrito
router.post('/', auth, cartController.addToCart);

// PUT /api/cart - Actualizar cantidad de un item
router.put('/', auth, cartController.updateCartItem);

// DELETE /api/cart/clear - Limpiar carrito completo
router.delete('/clear', auth, cartController.clearCart);

// DELETE /api/cart/:productId - Quitar item del carrito
router.delete('/:productId', auth, cartController.removeFromCart);

module.exports = router;
