/**
 * Modelo de Cupón de Descuento con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      isUppercase: true
    }
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    defaultValue: 'percentage'
  },
  discountValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  minPurchase: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Monto mínimo de compra para aplicar el cupón'
  },
  maxUses: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Límite de usos total. Null = ilimitado'
  },
  usedCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  perUserLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
    comment: 'Límite de usos por usuario'
  },
  startsAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de inicio de validez'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de expiración'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'coupons',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['code'] },
    { fields: ['is_active'] }
  ]
});

// Validación a nivel de instancia
Coupon.prototype.validateForUse = function(userId, purchaseAmount) {
  const now = new Date();
  
  // Verificar si está activo
  if (!this.isActive) {
    return { valid: false, message: 'El cupón no está activo' };
  }
  
  // Verificar fecha de inicio
  if (this.startsAt && new Date(this.startsAt) > now) {
    return { valid: false, message: 'El cupón aún no está vigente' };
  }
  
  // Verificar fecha de expiración
  if (this.expiresAt && new Date(this.expiresAt) < now) {
    return { valid: false, message: 'El cupón ha expirado' };
  }
  
  // Verificar límite de usos
  if (this.maxUses && this.usedCount >= this.maxUses) {
    return { valid: false, message: 'El cupón ha alcanzado su límite de usos' };
  }
  
  // Verificar monto mínimo de compra
  if (this.minPurchase && purchaseAmount < this.minPurchase) {
    return { valid: false, message: `Monto mínimo de compra: $${this.minPurchase.toLocaleString()}` };
  }
  
  return { valid: true };
};

Coupon.prototype.calculateDiscount = function(purchaseAmount) {
  if (this.discountType === 'percentage') {
    return Math.round(purchaseAmount * (this.discountValue / 100));
  }
  return Math.min(this.discountValue, purchaseAmount);
};

// Métodos estáticos
Coupon.findActive = async function() {
  const now = new Date();
  return await Coupon.findAll({
    where: {
      isActive: true,
      [require('sequelize').Op.or]: [
        { expiresAt: { [require('sequelize').Op.gte]: now } },
        { expiresAt: null }
      ]
    },
    order: [['createdAt', 'DESC']]
  });
};

Coupon.findByCode = async function(code) {
  return await Coupon.findOne({
    where: { 
      code: code.toUpperCase(),
      isActive: true
    }
  });
};

module.exports = Coupon;
