const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { auth } = require('../middleware/auth');

/**
 * Rutas de Cupones
 * GET /api/coupons - Obtener todos los cupones (admin)
 * GET /api/coupons/active - Obtener cupones activos (público)
 * GET /api/coupons/:id - Obtener cupón por ID
 * POST /api/coupons - Crear cupón (admin)
 * PUT /api/coupons/:id - Actualizar cupón (admin)
 * DELETE /api/coupons/:id - Eliminar cupón (admin)
 * POST /api/coupons/validate - Validar cupón para usar
 */

// Rutas públicas
router.get('/active', couponController.getActiveCoupons);
router.post('/validate', couponController.validateCoupon);

// Rutas de admin
router.get('/', auth, couponController.getAllCoupons);
router.get('/:id', auth, couponController.getCouponById);
router.post('/', auth, couponController.createCoupon);
router.put('/:id', auth, couponController.updateCoupon);
router.delete('/:id', auth, couponController.deleteCoupon);

module.exports = router;
