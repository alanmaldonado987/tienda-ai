/**
 * Rutas de Ofertas Countdown
 */
const express = require('express');
const router = express.Router();
const countdownController = require('../controllers/countdownController');
const { auth } = require('../middleware/auth');

router.get('/active', countdownController.getActive);
router.get('/featured', countdownController.getFeatured);

router.get('/', auth, countdownController.getAll);
router.post('/', auth, countdownController.create);
router.put('/:id', auth, countdownController.update);
router.delete('/:id', auth, countdownController.delete);

module.exports = router;
