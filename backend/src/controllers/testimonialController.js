/**
 * Controlador de Testimonios/Reseñas
 */
const Testimonial = require('../models/Testimonial');
const Product = require('../models/Product');
const { Op } = require('sequelize');

const testimonialController = {
  async create(req, res) {
    try {
      const { customerName, rating, title, comment, productId, avatar } = req.body;
      const userId = req.user?.id || null;

      if (!customerName || !rating || !comment) {
        return res.status(400).json({ 
          success: false, 
          message: 'customerName, rating y comment son requeridos' 
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
          success: false, 
          message: 'Rating debe ser entre 1 y 5' 
        });
      }

      const testimonial = await Testimonial.create({
        userId,
        productId,
        customerName,
        rating,
        title,
        comment,
        avatar,
        isApproved: false,
        isFeatured: false
      });

      res.status(201).json({ 
        success: true, 
        message: 'Testimonio enviado, awaitando aprobación',
        data: testimonial 
      });
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async getApproved(req, res) {
    try {
      const testimonials = await Testimonial.findAll({
        where: { isApproved: true },
        include: productId ? [{
          model: Product,
          as: 'product',
          required: false
        }] : [],
        order: [['createdAt', 'DESC']]
      });

      res.json({ success: true, data: testimonials });
    } catch (error) {
      console.error('Error getting testimonials:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async getFeatured(req, res) {
    try {
      const testimonials = await Testimonial.findAll({
        where: { isApproved: true, isFeatured: true },
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      res.json({ success: true, data: testimonials });
    } catch (error) {
      console.error('Error getting featured testimonials:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async getAll(req, res) {
    try {
      const testimonials = await Testimonial.findAll({
        include: [{
          model: Product,
          as: 'product',
          required: false
        }],
        order: [['createdAt', 'DESC']]
      });

      res.json({ success: true, data: testimonials });
    } catch (error) {
      console.error('Error getting all testimonials:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async approve(req, res) {
    try {
      const { id } = req.params;
      const { isApproved, isFeatured } = req.body;

      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        return res.status(404).json({ success: false, message: 'Testimonio no encontrado' });
      }

      if (isApproved !== undefined) testimonial.isApproved = isApproved;
      if (isFeatured !== undefined) testimonial.isFeatured = isFeatured;
      
      await testimonial.save();

      res.json({ success: true, data: testimonial });
    } catch (error) {
      console.error('Error approving testimonial:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const testimonial = await Testimonial.findByPk(id);
      if (!testimonial) {
        return res.status(404).json({ success: false, message: 'Testimonio no encontrado' });
      }

      await testimonial.destroy();

      res.json({ success: true, message: 'Testimonio eliminado' });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  }
};

module.exports = testimonialController;
