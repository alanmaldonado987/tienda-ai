const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de autenticación
 * POST /api/auth/register - Registrar usuario
 * POST /api/auth/login - Iniciar sesión
 * GET /api/auth/me - Obtener usuario actual (requiere auth)
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router;
