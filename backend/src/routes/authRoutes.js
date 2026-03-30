const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de autenticación
 * POST /api/auth/register - Registrar usuario
 * POST /api/auth/login - Iniciar sesión
 * POST /api/auth/refresh - Refrescar token JWT
 * POST /api/auth/logout - Cerrar sesión
 * POST /api/auth/logout-all - Cerrar sesión en todos lados (requiere auth)
 * GET /api/auth/me - Obtener usuario actual (requiere auth)
 * POST /api/auth/forgot-password - Solicitar reset de contraseña
 * POST /api/auth/reset-password - Restablecer contraseña con token
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/logout-all', auth, authController.logoutAll);
router.get('/me', auth, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
