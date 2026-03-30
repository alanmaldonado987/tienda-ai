const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de Administración de Usuarios
 * Todas las rutas requieren autenticación de admin
 */

// GET /api/admin/users - Obtener todos los usuarios
router.get('/', auth, userController.getAllUsers);

// GET /api/admin/users/:id - Obtener usuario por ID
router.get('/:id', auth, userController.getUserById);

// PUT /api/admin/users/:id - Actualizar usuario
router.put('/:id', auth, userController.updateUser);

// PUT /api/admin/users/:id/ban - Banear/desbanear usuario
router.put('/:id/ban', auth, userController.toggleUserBan);

// DELETE /api/admin/users/:id - Eliminar usuario
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
