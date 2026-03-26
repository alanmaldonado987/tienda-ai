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
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productImage: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  originalPrice: {
    type: DataTypes.DECIMAL(10, 2)
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  selectedColor: {
    type: DataTypes.STRING
  },
  selectedSize: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  underscored: true
});

// Métodos estáticos
OrderItem.findByOrderId = async function(orderId) {
  return await OrderItem.findAll({ where: { orderId } });
};

OrderItem.createItem = async function(itemData) {
  return await OrderItem.create(itemData);
};

module.exports = OrderItem;
