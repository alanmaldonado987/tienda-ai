const Product = require('../models/Product');

/**
 * Obtener todos los productos
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { category, gender, search, sort } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (gender) filters.gender = gender;
    if (search) filters.search = search;

    let products = await Product.findAll(filters);

    // Ordenar
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

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener productos'
    });
  }
};

/**
 * Obtener producto por ID
 */
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener producto'
    });
  }
};

/**
 * Obtener productos por categoría
 */
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const products = await Product.findByCategory(category);

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener productos por categoría'
    });
  }
};

/**
 * Crear producto (solo admin)
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error al crear producto'
    });
  }
};

/**
 * Actualizar producto (solo admin)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.updateProduct(id, req.body);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar producto'
    });
  }
};

/**
 * Eliminar producto (solo admin)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Product.deleteProduct(id);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error al eliminar producto'
    });
  }
};
