const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de Wishlist (Favoritos)
 * Todas las rutas requieren autenticación
 */

// GET /api/wishlist - Obtener favoritos del usuario
router.get('/', auth, wishlistController.getWishlist);

// POST /api/wishlist/toggle/:productId - Toggle favorito
router.post('/toggle/:productId', auth, wishlistController.toggleWishlist);

// POST /api/wishlist/:productId - Agregar a favoritos
router.post('/:productId', auth, wishlistController.addToWishlist);

// DELETE /api/wishlist/:productId - Quitar de favoritos
router.delete('/:productId', auth, wishlistController.removeFromWishlist);

module.exports = router;
