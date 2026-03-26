/**
 * Modelo de Wishlist (Favoritos) con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Wishlist = sequelize.define('Wishlist', {
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
  }
}, {
  tableName: 'wishlists',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id']
    }
  ]
});

// Definir relaciones
const Product = require('./Product');
Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlists' });

// Agregar favorito
Wishlist.addFavorite = async function(userId, productId) {
  const [favorite, created] = await Wishlist.findOrCreate({
    where: { userId, productId }
  });
  return { favorite, isNew: created };
};

// Quitar favorito
Wishlist.removeFavorite = async function(userId, productId) {
  const deleted = await Wishlist.destroy({
    where: { userId, productId }
  });
  return deleted > 0;
};

// Obtener favoritos de un usuario con datos del producto
Wishlist.getUserFavorites = async function(userId) {
  const Product = require('./Product');
  const favorites = await Wishlist.findAll({
    where: { userId },
    include: [{
      model: Product,
      as: 'product',
      required: true
    }],
    order: [['created_at', 'DESC']]
  });
  return favorites.map(f => f.product);
};

// Verificar si un producto está en favoritos
Wishlist.isFavorite = async function(userId, productId) {
  const favorite = await Wishlist.findOne({
    where: { userId, productId }
  });
  return !!favorite;
};

// Toggle favorito
Wishlist.toggleFavorite = async function(userId, productId) {
  const exists = await Wishlist.isFavorite(userId, productId);
  if (exists) {
    await Wishlist.removeFavorite(userId, productId);
    return { isFavorite: false, action: 'removed' };
  } else {
    await Wishlist.addFavorite(userId, productId);
    return { isFavorite: true, action: 'added' };
  }
};

module.exports = Wishlist;
