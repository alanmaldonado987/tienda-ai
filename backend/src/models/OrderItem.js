/**
 * Modelo de OrderItem con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'order_id',
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  underscored: true
});

OrderItem.findByOrderId = async function(orderId) {
  return await OrderItem.findAll({ where: { orderId } });
};

OrderItem.createItem = async function(itemData) {
  return await OrderItem.create(itemData);
};

module.exports = OrderItem;