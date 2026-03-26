const productService = require('../services/productService');

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
    if (sort) filters.sort = sort;

    const products = await productService.getAll(filters);

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
    const product = await productService.getById(id);

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    const status = error.message === 'Producto no encontrado' ? 404 : 500;
    res.status(status).json({
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
    const products = await productService.getByCategory(category);

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
    const product = await productService.create(req.body);

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
    const product = await productService.update(id, req.body);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });
  } catch (error) {
    const status = error.message === 'Producto no encontrado' ? 404 : 400;
    res.status(status).json({
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
    await productService.delete(id);

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
