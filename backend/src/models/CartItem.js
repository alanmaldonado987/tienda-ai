/**
 * Modelo de CartItem (Items del Carrito) con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  selectedColor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  selectedSize: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'cart_items',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id', 'selected_color', 'selected_size']
    }
  ]
});

// Definir relaciones
const Product = require('./Product');
CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });

// Agregar item al carrito
CartItem.addItem = async function(userId, productId, quantity = 1, selectedColor = null, selectedSize = null) {
  // Buscar si ya existe el item con las mismas opciones
  const existing = await CartItem.findOne({
    where: {
      userId,
      productId,
      selectedColor: selectedColor || null,
      selectedSize: selectedSize || null
    }
  });

  if (existing) {
    // Actualizar cantidad
    existing.quantity += quantity;
    await existing.save();
    return existing;
  }

  // Crear nuevo item
  return await CartItem.create({
    userId,
    productId,
    quantity,
    selectedColor,
    selectedSize
  });
};

// Actualizar cantidad
CartItem.updateQuantity = async function(userId, productId, quantity, selectedColor = null, selectedSize = null) {
  const item = await CartItem.findOne({
    where: {
      userId,
      productId,
      selectedColor: selectedColor || null,
      selectedSize: selectedSize || null
    }
  });

  if (!item) {
    throw new Error('Item no encontrado en el carrito');
  }

  if (quantity <= 0) {
    await item.destroy();
    return null;
  }

  item.quantity = quantity;
  await item.save();
  return item;
};

// Quitar item del carrito
CartItem.removeItem = async function(userId, productId, selectedColor = null, selectedSize = null) {
  const deleted = await CartItem.destroy({
    where: {
      userId,
      productId,
      selectedColor: selectedColor || null,
      selectedSize: selectedSize || null
    }
  });
  return deleted > 0;
};

// Obtener carrito completo con datos de productos
CartItem.getCart = async function(userId) {
  const Product = require('./Product');
  const items = await CartItem.findAll({
    where: { userId },
    include: [{
      model: Product,
      as: 'product',
      required: true
    }],
    order: [['created_at', 'DESC']]
  });

  return items.map(item => ({
    ...item.product.dataValues,
    cartItemId: item.id,
    quantity: item.quantity,
    selectedColor: item.selectedColor,
    selectedSize: item.selectedSize
  }));
};

// Limpiar carrito
CartItem.clearCart = async function(userId) {
  await CartItem.destroy({
    where: { userId }
  });
  return true;
};

// Obtener cantidad total de items
CartItem.getTotalItems = async function(userId) {
  const items = await CartItem.findAll({
    where: { userId }
  });
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

module.exports = CartItem;
