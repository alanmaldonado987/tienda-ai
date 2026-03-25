/**
 * Modelo de Orden con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'processing', 'shipped', 'delivered', 'cancelled']]
    }
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'shipping_address'
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true
});

Order.findAllOrders = async function(filters = {}) {
  const where = {};
  if (filters.userId) {
    where.userId = filters.userId;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  return await Order.findAll({ where, order: [['createdAt', 'DESC']] });
};

Order.findById = async function(id) {
  return await Order.findByPk(id, {
    include: ['items']
  });
};

Order.createOrder = async function(orderData) {
  return await Order.create(orderData);
};

Order.updateStatus = async function(id, status) {
  const order = await Order.findByPk(id);
  if (!order) {
    throw new Error('Orden no encontrada');
  }
  return await order.update({ status });
};

module.exports = Order;