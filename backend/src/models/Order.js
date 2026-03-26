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
  orderNumber: {
    type: DataTypes.STRING(20),
    unique: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'processing', 'shipped', 'delivered', 'cancelled']]
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  // Datos de envío
  shippingName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingDepartment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingZipCode: {
    type: DataTypes.STRING
  },
  shippingNotes: {
    type: DataTypes.TEXT
  },
  // Payment
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'cash'
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'paid', 'failed', 'refunded']]
    }
  },
  paymentId: {
    type: DataTypes.STRING
  },
  // Tracking
  trackingNumber: {
    type: DataTypes.STRING
  },
  shippedAt: {
    type: DataTypes.DATE
  },
  deliveredAt: {
    type: DataTypes.DATE
  },
  cancelledAt: {
    type: DataTypes.DATE
  },
  cancellationReason: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true
});

// Generar número de orden único
Order.generateOrderNumber = function() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Métodos estáticos
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
  return await Order.findByPk(id);
};

Order.createOrder = async function(orderData) {
  return await Order.create(orderData);
};

Order.updateStatus = async function(id, status) {
  const order = await Order.findByPk(id);
  if (!order) {
    throw new Error('Orden no encontrada');
  }
  
  const updateData = { status };
  if (status === 'shipped') {
    updateData.shippedAt = new Date();
  } else if (status === 'delivered') {
    updateData.deliveredAt = new Date();
  } else if (status === 'cancelled') {
    updateData.cancelledAt = new Date();
  }
  
  return await order.update(updateData);
};

module.exports = Order;
