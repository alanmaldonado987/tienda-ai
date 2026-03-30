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
    allowNull: true,
    field: 'image'
  },
  images: {
    type: DataTypes.VIRTUAL,
    get() {
      return parseImageField(this.getDataValue('image'));
    }
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
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    field: 'low_stock_threshold',
    comment: 'Umbral para notificación de stock bajo'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  isNew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_new',
    comment: 'Producto nuevo/novedad'
  },
  discountPrice: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'discount_price',
    comment: 'Precio con descuento'
  },
  discountEndDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'discount_end_date',
    comment: 'Fecha fin de descuento'
  },
  showDiscount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'show_discount',
    comment: 'Mostrar badge de descuento'
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
  toJSON: function() {
    const values = { ...this.get() };
    if (!values.images || !Array.isArray(values.images)) {
      values.images = values.image ? [values.image] : ['https://via.placeholder.com/800x1000?text=No+Image'];
    }
    return values;
  }
});

Product.addImagesField = function(product) {
  const data = product.dataValues || product;
  data.images = parseImageField(data.image);
  return product;
};

function parseImageField(imageValue) {
  if (typeof imageValue !== 'string') {
    return ['https://via.placeholder.com/800x1000?text=No+Image'];
  }

  const rawValue = imageValue.trim();
  if (!rawValue || rawValue === 'undefined' || rawValue === 'null') {
    return ['https://via.placeholder.com/800x1000?text=No+Image'];
  }

  if (rawValue.startsWith('[')) {
    try {
      const parsed = JSON.parse(rawValue);
      if (Array.isArray(parsed)) {
        const validImages = parsed
          .filter((item) => typeof item === 'string')
          .map((item) => item.trim())
          .filter((item) => item && item !== 'undefined' && item !== 'null');
        if (validImages.length > 0) {
          return validImages;
        }
      }
    } catch (error) {}
  }

  if (rawValue.includes('|')) {
    const splitImages = rawValue
      .split('|')
      .map((item) => item.trim())
      .filter((item) => item && item !== 'undefined' && item !== 'null');
    if (splitImages.length > 0) {
      return splitImages;
    }
  }

  return [rawValue];
}

const { Op } = require('sequelize');

Product.findWithFilters = async function(filters = {}) {
  const where = {};
  
  if (filters.category) {
    where.category = filters.category;
  }
  
  if (filters.gender) {
    where.gender = { [Op.or]: [filters.gender, 'unisex'] };
  }
  
  if (filters.search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${filters.search}%` } },
      { description: { [Op.iLike]: `%${filters.search}%` } }
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

Product.migrateImages = async function() {
  const products = await Product.findAll();
  let migrated = 0;
  
  for (const product of products) {
    const imageValue = product.getDataValue('image');
    if (!imageValue || imageValue === 'undefined') {
      const dataValues = product.dataValues || {};
      if (dataValues.images && Array.isArray(dataValues.images) && dataValues.images.length > 0) {
        await product.update({ image: dataValues.images[0] });
        migrated++;
      }
    }
  }
};

Product.seedInitial = async function() {
  await Product.migrateImages();
  
  const count = await Product.count();
  if (count > 0) return;
  
  const { randomUUID } = require('crypto');
  const initialProducts = [
    {
      id: randomUUID(),
      name: "Camisa Manga Larga Classic",
      price: 89900,
      originalPrice: 119900,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1000&fit=crop",
      category: "hombre",
      gender: "hombre",
      tag: "Nuevo",
      colors: ["#F5F5F5", "#1a1a1a", "#3B82F6"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "Camisa clásica de manga larga, perfecta para ocasiones formales o casuales. Fabricada en algodón premium con acabado suave.",
      stock: 50
    },
    {
      id: randomUUID(),
      name: "Jeans Slim Fit",
      price: 129900,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop",
      category: "jeans",
      gender: "hombre",
      tag: "Best Seller",
      colors: ["#1a1a1a", "#2F4F4F", "#4B5563"],
      sizes: ["28", "30", "32", "34", "36"],
      description: "Jeans slim fit de alta calidad, cómodos y modernos. Denim premium con tecnología stretch.",
      stock: 100
    },
    {
      id: randomUUID(),
      name: "Sudadera con Capucha",
      price: 99900,
      originalPrice: 149900,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop",
      category: "sudadera",
      gender: "unisex",
      tag: "Oferta",
      colors: ["#1a1a1a", "#F5F5F5", "#374151"],
      sizes: ["S", "M", "L", "XL"],
      description: "Sudadera cómoda con capucha, ideal para el día a día. Algodón orgánico conforable.",
      stock: 75
    },
    {
      id: randomUUID(),
      name: "Vestido Midi Floral",
      price: 159900,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop",
      category: "vestidos",
      gender: "mujer",
      tag: null,
      colors: ["#E8C4B8", "#1a1a1a"],
      sizes: ["XS", "S", "M", "L"],
      description: "Elegante vestido midi con estampado floral. Perfecto para ocasiones especiales.",
      stock: 30
    },
    {
      id: randomUUID(),
      name: "Zapatillas Urbanas",
      price: 199900,
      originalPrice: 259900,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop",
      category: "zapatos",
      gender: "unisex",
      tag: "Descuento",
      colors: ["#1a1a1a", "#FFFFFF", "#DC2626"],
      sizes: ["36", "37", "38", "39", "40", "41", "42"],
      description: "Zapatillas urbanas modernas y cómodas. Suela acolchada para máximo confort.",
      stock: 60
    }
  ];
  
  await Product.bulkCreate(initialProducts);
};

module.exports = Product;