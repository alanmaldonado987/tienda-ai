const productService = require('../services/productService');
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
    if (sort) filters.sort = sort;

    const products = await productService.getAll(filters);
    const productsWithImages = products.map(p => Product.addImagesField(p));

    res.json({
      success: true,
      data: productsWithImages,
      count: productsWithImages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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
    Product.addImagesField(product);

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    const status = error.message === 'Producto no encontrado' ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
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
    const productsWithImages = products.map(p => Product.addImagesField(p));

    res.json({
      success: true,
      data: productsWithImages,
      count: productsWithImages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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
      message: error.message
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
      message: error.message
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
      message: error.message
    });
  }
};

/**
 * Obtener inventario de todos los productos
 */
exports.getInventory = async (req, res, next) => {
  try {
    const products = await productService.getAllInventory();
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener productos con stock bajo
 */
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const products = await productService.getLowStock();
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener inventario de un producto
 */
exports.getProductInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        isLowStock: product.stock <= product.lowStockThreshold,
        lastRestocked: product.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Actualizar inventario de un producto
 */
exports.updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock, lowStockThreshold } = req.body;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    await product.update({
      stock: stock !== undefined ? stock : product.stock,
      lowStockThreshold: lowStockThreshold !== undefined ? lowStockThreshold : product.lowStockThreshold
    });
    
    res.json({
      success: true,
      message: 'Inventario actualizado',
      data: {
        id: product.id,
        name: product.name,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        isLowStock: product.stock <= product.lowStockThreshold
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Ajustar stock (incremento o decremento)
 */
exports.adjustStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adjustment, reason } = req.body; // adjustment: número positivo o negativo
    
    if (adjustment === undefined || isNaN(adjustment)) {
      return res.status(400).json({
        success: false,
        message: 'El ajuste debe ser un número'
      });
    }
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    const newStock = product.stock + adjustment;
    
    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay suficiente stock'
      });
    }
    
    await product.update({ stock: newStock });
    
    res.json({
      success: true,
      message: `Stock ajustado${reason ? `: ${reason}` : ''}`,
      data: {
        id: product.id,
        name: product.name,
        previousStock: product.stock - adjustment,
        newStock: product.stock,
        adjustment,
        isLowStock: product.stock <= product.lowStockThreshold
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener productos nuevos (isNew = true)
 */
exports.getNewProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const products = await Product.findAll({
      where: { isNew: true, isActive: true },
      order: [['createdAt', 'DESC']],
      limit
    });
    
    const productsWithImages = products.map(p => Product.addImagesField(p));
    
    res.json({
      success: true,
      data: productsWithImages,
      count: productsWithImages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener productos en oferta (discountPrice > 0 y vigente)
 */
exports.getOnSaleProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const now = new Date();
    
    const products = await Product.findAll({
      where: {
        isActive: true,
        showDiscount: true,
        discountPrice: { [require('sequelize').Op.ne]: null }
      },
      order: [['discountEndDate', 'DESC']],
      limit
    });
    
    const validProducts = products.filter(p => {
      if (!p.discountEndDate) return true;
      return new Date(p.discountEndDate) > now;
    });
    
    const productsWithImages = validProducts.map(p => Product.addImagesField(p));
    
    res.json({
      success: true,
      data: productsWithImages,
      count: productsWithImages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener productos relacionados (por categoría, luego género, luego random)
 */
exports.getRelatedProducts = async (req, res) => {
  try {
    const { productId, category, gender, limit = 4 } = req.query;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: 'productId es requerido' 
      });
    }

    const limitNum = parseInt(limit);
    let relatedProducts = [];

    // 1. Buscar por misma categoría (excluyendo el producto actual)
    if (category) {
      const byCategory = await Product.findAll({
        where: {
          category,
          id: { [require('sequelize').Op.ne]: productId },
          isActive: true
        },
        order: [['createdAt', 'DESC']],
        limit: limitNum * 2
      });
      relatedProducts = [...byCategory];
    }

    // 2. Si no hay suficientes, buscar por mismo género
    if (relatedProducts.length < limitNum && gender) {
      const byGender = await Product.findAll({
        where: {
          gender: { [require('sequelize').Op.or]: [gender, 'unisex'] },
          id: { [require('sequelize').Op.ne]: productId },
          isActive: true,
          ...(category && { category: { [require('sequelize').Op.ne]: category } })
        },
        order: [['createdAt', 'DESC']],
        limit: (limitNum - relatedProducts.length) * 2
      });
      
      const existingIds = new Set(relatedProducts.map(p => p.id));
      byGender.forEach(p => {
        if (!existingIds.has(p.id)) {
          relatedProducts.push(p);
        }
      });
    }

    // 3. Si aún no hay suficientes, buscar random
    if (relatedProducts.length < limitNum) {
      const remaining = limitNum - relatedProducts.length;
      const existingIds = new Set(relatedProducts.map(p => p.id));
      existingIds.add(productId);
      
      const random = await Product.findAll({
        where: {
          id: { [require('sequelize').Op.notIn]: Array.from(existingIds) },
          isActive: true
        },
        order: require('sequelize').literal('RANDOM()'),
        limit: remaining
      });
      relatedProducts = [...relatedProducts, ...random];
    }

    const finalProducts = relatedProducts.slice(0, limitNum).map(p => Product.addImagesField(p));
    
    res.json({
      success: true,
      data: finalProducts,
      count: finalProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
