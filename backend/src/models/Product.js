/**
 * Modelo de Producto con Sequelize
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  originalPrice: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'original_price'
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  colors: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  sizes: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true
});

// Métodos estáticos (compatibles con API anterior)
Product.findAll = async function(filters = {}) {
  const where = {};
  
  if (filters.category) {
    where.category = filters.category;
  }
  
  if (filters.gender) {
    where.gender = { [sequelize.Sequelize.Op.or]: [filters.gender, 'unisex'] };
  }
  
  if (filters.search) {
    where[sequelize.Sequelize.Op.or] = [
      { name: { [sequelize.Sequelize.Op.iLike]: `%${filters.search}%` } },
      { description: { [sequelize.Sequelize.Op.iLike]: `%${filters.search}%` } }
    ];
  }
  
  return await Product.findAll({ where });
};

Product.findById = async function(id) {
  return await Product.findByPk(id);
};

Product.findByCategory = async function(category) {
  return await Product.findAll({ where: { category } });
};

Product.createProduct = async function(productData) {
  return await Product.create(productData);
};

Product.updateProduct = async function(id, productData) {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  return await product.update(productData);
};

Product.deleteProduct = async function(id) {
  const product = await Product.findByPk(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  await product.destroy();
  return true;
};

// Seeds iniciales (solo si no hay productos)
Product.seedInitial = async function() {
  const count = await Product.count();
  if (count > 0) return;
  
  const { v4: uuidv4 } = require('uuid');
  const initialProducts = [
    {
      id: uuidv4(),
      name: "Camisa Manga Larga Classic",
      price: 89900,
      originalPrice: 119900,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
      category: "hombre",
      gender: "hombre",
      tag: "Nuevo",
      colors: ["#F5F5F5", "#1a1a1a", "#3B82F6"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "Camisa clásica de manga larga, perfecta para ocasiones formales o casuales.",
      stock: 50
    },
    {
      id: uuidv4(),
      name: "Jeans Slim Fit",
      price: 129900,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
      category: "jeans",
      gender: "hombre",
      tag: "Best Seller",
      colors: ["#1a1a1a", "#2F4F4F", "#4B5563"],
      sizes: ["28", "30", "32", "34", "36"],
      description: "Jeans slim fit de alta calidad, cómodos y modernos.",
      stock: 100
    },
    {
      id: uuidv4(),
      name: "Sudadera con Capucha",
      price: 99900,
      originalPrice: 149900,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
      category: "sudadera",
      gender: "unisex",
      tag: "Oferta",
      colors: ["#1a1a1a", "#F5F5F5", "#374151"],
      sizes: ["S", "M", "L", "XL"],
      description: "Sudadera cómoda con capucha, ideal para el día a día.",
      stock: 75
    },
    {
      id: uuidv4(),
      name: "Vestido Midi Floral",
      price: 159900,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
      category: "vestidos",
      gender: "mujer",
      tag: null,
      colors: ["#E8C4B8", "#1a1a1a"],
      sizes: ["XS", "S", "M", "L"],
      description: "Elegante vestido midi con estampado floral.",
      stock: 30
    },
    {
      id: uuidv4(),
      name: "Zapatillas Urbanas",
      price: 199900,
      originalPrice: 259900,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
      category: "zapatos",
      gender: "unisex",
      tag: "Descuento",
      colors: ["#1a1a1a", "#FFFFFF", "#DC2626"],
      sizes: ["36", "37", "38", "39", "40", "41", "42"],
      description: "Zapatillas urbanas modernas y cómodas.",
      stock: 60
    }
  ];
  
  await Product.bulkCreate(initialProducts);
  console.log('✅ Initial products seeded');
};

module.exports = Product;