/**
 * Modelo de Ofertas con Countdown
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CountdownOffer = sequelize.define('CountdownOffer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Título de la oferta'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción de la oferta'
  },
  discountPercent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'discount_percent',
    validate: {
      min: 1,
      max: 100
    },
    comment: 'Porcentaje de descuento'
  },
  discountCode: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'discount_code',
    comment: 'Código de descuento (opcional)'
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Imagen/banner de la oferta'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date',
    comment: 'Fecha inicio de la oferta'
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date',
    comment: 'Fecha fin de la oferta'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
    comment: 'Oferta activa'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured',
    comment: 'Mostrar prominente en home'
  },
  productIds: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'product_ids',
    defaultValue: [],
    comment: 'IDs de productos específicos (vacío = todos)'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Categoría afectada'
  }
}, {
  tableName: 'countdown_offers',
  timestamps: true,
  underscored: true
});

module.exports = CountdownOffer;
