/**
 * Rutas de Testimonios
 */
const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { auth } = require('../middleware/auth');

router.get('/approved', testimonialController.getApproved);
router.get('/featured', testimonialController.getFeatured);

router.get('/', auth, testimonialController.getAll);
router.post('/', testimonialController.create);
router.put('/:id/approve', auth, testimonialController.approve);
router.delete('/:id', auth, testimonialController.delete);

module.exports = router;
