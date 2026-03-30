/**
 * Modelo de Colección-Producto con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CollectionProduct = sequelize.define('CollectionProduct', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  collectionId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'collection_id',
    references: {
      model: 'collections',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id'
    }
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'sort_order'
  }
}, {
  tableName: 'collection_products',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['collection_id', 'product_id']
    }
  ]
});

module.exports = CollectionProduct;
