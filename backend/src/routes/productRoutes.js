const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, optionalAuth } = require('../middleware/auth');

/**
 * Rutas de productos
 * GET /api/products - Obtener todos los productos
 * GET /api/products/:id - Obtener producto por ID
 * GET /api/products/category/:category - Obtener productos por categoría
 * POST /api/products - Crear producto (admin)
 * PUT /api/products/:id - Actualizar producto (admin)
 * DELETE /api/products/:id - Eliminar producto (admin)
 */

// Rutas públicas
router.get('/category/:category', productController.getProductsByCategory);
router.get('/new', productController.getNewProducts);
router.get('/sale', productController.getOnSaleProducts);
router.get('/:id', productController.getProductById);
router.get('/', optionalAuth, productController.getProducts);

// Rutas de admin
router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
