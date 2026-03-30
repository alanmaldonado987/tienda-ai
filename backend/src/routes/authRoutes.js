const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de autenticación
 * POST /api/auth/register - Registrar usuario
 * POST /api/auth/login - Iniciar sesión
 * GET /api/auth/me - Obtener usuario actual (requiere auth)
 * POST /api/auth/forgot-password - Solicitar reset de contraseña
 * POST /api/auth/reset-password - Restablecer contraseña con token
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
