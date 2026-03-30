/**
 * Controlador de Productos Vistos Recientemente
 */
const RecentlyViewed = require('../models/RecentlyViewed');
const Product = require('../models/Product');
const { Op } = require('sequelize');

const recentlyViewedController = {
  async add(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.user?.id || null;
      const sessionId = req.body.sessionId || req.headers['x-session-id'] || null;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'productId es requerido' });
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      const existing = await RecentlyViewed.findOne({
        where: {
          [Op.or]: [
            { userId, productId },
            { sessionId, productId }
          ]
        }
      });

      if (existing) {
        existing.viewedAt = new Date();
        await existing.save();
        return res.json({ success: true, data: existing });
      }

      const viewed = await RecentlyViewed.create({
        userId,
        sessionId,
        productId,
        viewedAt: new Date()
      });

      const count = await RecentlyViewed.count({
        where: userId ? { userId } : { sessionId }
      });

      if (count > 20) {
        const oldest = await RecentlyViewed.findOne({
          where: userId ? { userId } : { sessionId },
          order: [['viewedAt', 'ASC']]
        });
        if (oldest) await oldest.destroy();
      }

      res.status(201).json({ success: true, data: viewed });
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async getByUser(req, res) {
    try {
      const userId = req.user?.id || null;
      const sessionId = req.query.sessionId || req.headers['x-session-id'] || null;

      const viewed = await RecentlyViewed.findAll({
        where: userId ? { userId } : { sessionId: { [Op.ne]: null }, sessionId },
        include: [{
          model: Product,
          as: 'product',
          required: true
        }],
        order: [['viewedAt', 'DESC']],
        limit: 20
      });

      res.json({ success: true, data: viewed });
    } catch (error) {
      console.error('Error getting recently viewed:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async clear(req, res) {
    try {
      const userId = req.user?.id || null;
      const sessionId = req.body.sessionId || null;

      await RecentlyViewed.destroy({
        where: userId ? { userId } : { sessionId }
      });

      res.json({ success: true, message: 'Historial limpiado' });
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  }
};

module.exports = recentlyViewedController;
