const Category = require('../models/Category');

/**
 * Helper: generar slug desde nombre
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Obtener todas las categorías
 */
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAllCategories();
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener categoría por ID
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Crear categoría (admin)
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es requerido'
      });
    }
    
    // Generar slug automático
    let slug = generateSlug(name);
    
    // Verificar que no exista
    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    
    const category = await Category.create({
      name,
      slug,
      description
    });
    
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Actualizar categoría (admin)
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    // Si cambia el nombre, actualizar slug
    let slug = category.slug;
    if (name && name !== category.name) {
      slug = generateSlug(name);
      const existing = await Category.findOne({ where: { slug, id: { [require('sequelize').Op.ne]: id } } });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }
    }
    
    await category.update({
      name: name || category.name,
      slug,
      description: description !== undefined ? description : category.description
    });
    
    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Eliminar categoría (admin)
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    await category.destroy();
    
    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
