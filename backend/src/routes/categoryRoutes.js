const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de Categorías
 * GET /api/categories - Obtener todas las categorías
 * GET /api/categories/:id - Obtener categoría por ID
 * POST /api/categories - Crear categoría (admin)
 * PUT /api/categories/:id - Actualizar categoría (admin)
 * DELETE /api/categories/:id - Eliminar categoría (admin)
 */

// Rutas públicas
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Rutas de admin
router.post('/', auth, categoryController.createCategory);
router.put('/:id', auth, categoryController.updateCategory);
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
