/**
 * Controlador de Ofertas Countdown
 */
const CountdownOffer = require('../models/CountdownOffer');

const countdownController = {
  async create(req, res) {
    try {
      const { title, description, discountPercent, discountCode, image, startDate, endDate, isActive, isFeatured, productIds, category } = req.body;

      if (!title || !discountPercent || !startDate || !endDate) {
        return res.status(400).json({ 
          success: false, 
          message: 'title, discountPercent, startDate y endDate son requeridos' 
        });
      }

      const offer = await CountdownOffer.create({
        title,
        description,
        discountPercent,
        discountCode,
        image,
        startDate,
        endDate,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        productIds: productIds || [],
        category
      });

      res.status(201).json({ success: true, data: offer });
    } catch (error) {
      console.error('Error creating countdown offer:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async getActive(req, res) {
    try {
      const now = new Date();
      
      const offers = await CountdownOffer.findAll({
        where: {
          isActive: true,
          startDate: { [require('sequelize').Op.lte]: now },
          endDate: { [require('sequelize').Op.gte]: now }
        },
        order: [['endDate', 'ASC']]
      });

      res.json({ success: true, data: offers });
    } catch (error) {
      console.error('Error getting active offers:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async getFeatured(req, res) {
    try {
      const now = new Date();
      
      const offers = await CountdownOffer.findAll({
        where: {
          isActive: true,
          isFeatured: true,
          startDate: { [require('sequelize').Op.lte]: now },
          endDate: { [require('sequelize').Op.gte]: now }
        },
        order: [['endDate', 'ASC']],
        limit: 1
      });

      res.json({ success: true, data: offers });
    } catch (error) {
      console.error('Error getting featured offer:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async getAll(req, res) {
    try {
      const offers = await CountdownOffer.findAll({
        order: [['createdAt', 'DESC']]
      });

      res.json({ success: true, data: offers });
    } catch (error) {
      console.error('Error getting all offers:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const offer = await CountdownOffer.findByPk(id);
      if (!offer) {
        return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
      }

      await offer.update(updates);

      res.json({ success: true, data: offer });
    } catch (error) {
      console.error('Error updating offer:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const offer = await CountdownOffer.findByPk(id);
      if (!offer) {
        return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
      }

      await offer.destroy();

      res.json({ success: true, message: 'Oferta eliminada' });
    } catch (error) {
      console.error('Error deleting offer:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  }
};

module.exports = countdownController;
