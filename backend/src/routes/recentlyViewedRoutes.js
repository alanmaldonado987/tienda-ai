/**
 * Rutas de Productos Vistos Recientemente
 */
const express = require('express');
const router = express.Router();
const recentlyViewedController = require('../controllers/recentlyViewedController');

router.post('/', recentlyViewedController.add);
router.get('/', recentlyViewedController.getByUser);
router.delete('/', recentlyViewedController.clear);

module.exports = router;
