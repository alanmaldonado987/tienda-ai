const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de Usuario
 * Todas las rutas requieren autenticación
 */

// GET /api/users/profile - Obtener perfil
router.get('/profile', auth, userController.getProfile);

// PUT /api/users/profile - Actualizar perfil
router.put('/profile', auth, userController.updateProfile);

// PUT /api/users/password - Cambiar contraseña
router.put('/password', auth, userController.changePassword);

module.exports = router;
