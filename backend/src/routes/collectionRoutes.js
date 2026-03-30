/**
 * Rutas de Colecciones
 */
const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const { auth } = require('../middleware/auth');

// Rutas públicas
router.get('/active', collectionController.getActive);
router.get('/featured', collectionController.getFeatured);
router.get('/slug/:slug', collectionController.getBySlug);
router.get('/:id', collectionController.getById);

// Rutas protegidas (admin)
router.post('/', auth, collectionController.create);
router.put('/:id', auth, collectionController.update);
router.delete('/:id', auth, collectionController.delete);

// Productos en colección
router.post('/:id/products', auth, collectionController.addProducts);
router.delete('/:id/products/:productId', auth, collectionController.removeProduct);
router.put('/:id/reorder', auth, collectionController.reorderProducts);

// Get all (admin only)
router.get('/', auth, collectionController.getAll);

module.exports = router;
