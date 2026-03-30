/**
 * Modelo de Testimonios/Reseñas de Clientes
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
    comment: 'Usuario que escribió la reseña (null si es anónimo)'
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'product_id',
    comment: 'Producto reseñado (opcional)'
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_name'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'Calificación 1-5 estrellas'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Título de la reseña'
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Contenido de la reseña'
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'avatar',
    comment: 'URL del avatar del cliente'
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_approved',
    comment: 'Aprobado por admin para mostrar'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured',
    comment: 'Mostrar en home'
  }
}, {
  tableName: 'testimonials',
  timestamps: true,
  underscored: true
});

module.exports = Testimonial;
