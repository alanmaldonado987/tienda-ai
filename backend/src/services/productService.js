/**
 * Product Service - Lógica de negocio para productos
 */
const Product = require('../models/Product');

class ProductService {
  normalizeProductInput(data = {}) {
    const normalized = { ...data };
    if (Array.isArray(normalized.images) && normalized.images.length > 0) {
      const validImages = normalized.images
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item && item !== 'undefined' && item !== 'null');

      if (validImages.length > 0) {
        normalized.image = JSON.stringify(validImages);
      }
      delete normalized.images;
    }
    return normalized;
  }

  /**
   * Obtener todos los productos con filtros y ordenamiento
   * @param {Object} filters - Filtros (category, gender, search, sort)
   * @returns {Promise<Array>}
   */
  async getAll(filters = {}) {
    const { category, gender, search, sort } = filters;
    
    const queryFilters = {};
    if (category) queryFilters.category = category;
    if (gender) queryFilters.gender = gender;
    if (search) queryFilters.search = search;

    let products = await Product.findWithFilters(queryFilters);

    // Ordenar resultados
    if (sort) {
      switch (sort) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    return products;
  }

  /**
   * Obtener producto por ID
   * @param {string} id - ID del producto
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  /**
   * Obtener productos por categoría
   * @param {string} category - Categoría
   * @returns {Promise<Array>}
   */
  async getByCategory(category) {
    return await Product.findByCategory(category);
  }

  /**
   * Crear nuevo producto
   * @param {Object} data - Datos del producto
   * @returns {Promise<Object>}
   */
  async create(data) {
    return await Product.create(this.normalizeProductInput(data));
  }

  /**
   * Actualizar producto
   * @param {string} id - ID del producto
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    const product = await Product.updateProduct(id, this.normalizeProductInput(data));
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  /**
   * Eliminar producto
   * @param {string} id - ID del producto
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    await Product.deleteProduct(id);
    return true;
  }

  /**
   * Obtener todos los productos con info de inventario
   * @returns {Promise<Array>}
   */
  async getAllInventory() {
    return await Product.findAll({
      attributes: ['id', 'name', 'price', 'stock', 'lowStockThreshold', 'isActive', 'updatedAt'],
      order: [['stock', 'ASC']]
    });
  }

  /**
   * Obtener productos con stock bajo
   * @returns {Promise<Array>}
   */
  async getLowStock() {
    return await Product.findAll({
      attributes: ['id', 'name', 'price', 'stock', 'lowStockThreshold', 'updatedAt'],
      where: require('sequelize').literal('stock <= "low_stock_threshold"'),
      order: [['stock', 'ASC']]
    });
  }
}

module.exports = new ProductService();