const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de pagos - MercadoPago
 * 
 * POST /api/payments/create-preference - Crear preferencia de pago
 * POST /api/payments/webhook - Webhook de MercadoPago (sin auth)
 * GET  /api/payments/order/:orderId - Obtener estado del pago por orden
 * POST /api/payments/verify/:orderId - Verificar pago manualmente
 */

// Crear preferencia (requiere auth)
router.post('/create-preference', auth, paymentController.createPreference);

// Webhook de MP (NO requiere auth - viene de MP)
router.post('/webhook', paymentController.webhook);

// Obtener estado del pago
router.get('/order/:orderId', paymentController.getPaymentStatus);

// Verificar pago manualmente
router.post('/verify/:orderId', auth, paymentController.verifyPayment);

module.exports = router;
