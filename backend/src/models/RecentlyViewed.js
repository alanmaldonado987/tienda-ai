/**
 * Modelo de Productos Vistos Recientemente
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecentlyViewed = sequelize.define('RecentlyViewed', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
    comment: 'Usuario (null si no está logueado)'
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'session_id',
    comment: 'Session ID para usuarios no logueados'
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id'
  },
  viewedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'viewed_at'
  }
}, {
  tableName: 'recently_viewed',
  timestamps: true,
  underscored: true
});

module.exports = RecentlyViewed;
