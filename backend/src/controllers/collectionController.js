/**
 * Controlador de Colecciones
 */
const Collection = require('../models/Collection');
const CollectionProduct = require('../models/CollectionProduct');
const Product = require('../models/Product');
const { Op } = require('sequelize');

// Generar slug desde el nombre
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[áéíóúñ]/g, (c) => 'aeiou'.includes(c) ? c : 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all collections (admin)
exports.getAll = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      include: [{
        model: Product,
        as: 'products',
        through: { attributes: ['sortOrder'] },
        attributes: ['id', 'name', 'price', 'image']
      }]
    });

    const collectionsWithCount = collections.map(c => {
      const data = c.toJSON();
      return {
        ...data,
        productCount: data.products?.length || 0
      };
    });

    res.json({
      success: true,
      data: collectionsWithCount
    });
  } catch (error) {
    console.error('Error getting collections:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener colecciones'
    });
  }
};

// Get active collections for home
exports.getActive = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      include: [{
        model: Product,
        as: 'products',
        through: { attributes: ['sortOrder'] },
        where: { isActive: true },
        required: false,
        attributes: ['id', 'name', 'price', 'originalPrice', 'image', 'category', 'stock']
      }]
    });

    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    console.error('Error getting active collections:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener colecciones'
    });
  }
};

// Get featured collections for home
exports.getFeatured = async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { isActive: true, isFeature: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']],
      include: [{
        model: Product,
        as: 'products',
        through: { attributes: ['sortOrder'] },
        where: { isActive: true },
        required: false,
        attributes: ['id', 'name', 'price', 'originalPrice', 'image', 'category', 'stock', 'gender']
      }]
    });

    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    console.error('Error getting featured collections:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener colecciones destacadas'
    });
  }
};

// Get single collection
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const collection = await Collection.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        through: { attributes: ['sortOrder'] },
        where: { isActive: true },
        required: false
      }]
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Colección no encontrada'
      });
    }

    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    console.error('Error getting collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener colección'
    });
  }
};

// Get collection by slug
exports.getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const collection = await Collection.findOne({
      where: { slug },
      include: [{
        model: Product,
        as: 'products',
        through: { attributes: ['sortOrder'] },
        where: { isActive: true },
        required: false
      }]
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Colección no encontrada'
      });
    }

    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    console.error('Error getting collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener colección'
    });
  }
};

// Create collection
exports.create = async (req, res) => {
  try {
    const { name, description, image, isActive, isFeature, sortOrder, productIds } = req.body;

    // Generate unique slug
    let slug = generateSlug(name);
    const existing = await Collection.findOne({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const collection = await Collection.create({
      name,
      slug,
      description,
      image,
      isActive: isActive ?? true,
      isFeature: isFeature ?? false,
      sortOrder: sortOrder ?? 0
    });

    // Add products if provided
    if (productIds && productIds.length > 0) {
      const products = productIds.map((productId, index) => ({
        collectionId: collection.id,
        productId,
        sortOrder: index
      }));
      await CollectionProduct.bulkCreate(products);
    }

    // Fetch with products
    const created = await Collection.findByPk(collection.id, {
      include: [{
        model: Product,
        as: 'products',
        through: { attributes: ['sortOrder'] }
      }]
    });

    res.status(201).json({
      success: true,
      data: created
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear colección'
    });
  }
};

// Update collection
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive, isFeature, sortOrder } = req.body;

    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Colección no encontrada'
      });
    }

    // Update slug if name changed
    let slug = collection.slug;
    if (name && name !== collection.name) {
      slug = generateSlug(name);
      const existing = await Collection.findOne({ where: { slug: slug, id: { [Op.ne]: id } } });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    await collection.update({
      name: name || collection.name,
      slug,
      description: description !== undefined ? description : collection.description,
      image: image !== undefined ? image : collection.image,
      isActive: isActive !== undefined ? isActive : collection.isActive,
      isFeature: isFeature !== undefined ? isFeature : collection.isFeature,
      sortOrder: sortOrder !== undefined ? sortOrder : collection.sortOrder
    });

    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar colección'
    });
  }
};

// Add products to collection
exports.addProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { productIds } = req.body;

    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Colección no encontrada'
      });
    }

    // Get current max sortOrder
    const lastProduct = await CollectionProduct.findOne({
      where: { collectionId: id },
      order: [['sortOrder', 'DESC']]
    });
    let sortOrder = (lastProduct?.sortOrder || 0) + 1;

    // Add new products
    const newProducts = productIds.map(productId => ({
      collectionId: id,
      productId,
      sortOrder: sortOrder++
    }));

    await CollectionProduct.bulkCreate(newProducts, { ignoreDuplicates: true });

    const updated = await Collection.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        through: { attributes: ['sortOrder'] }
      }]
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error adding products to collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar productos'
    });
  }
};

// Remove product from collection
exports.removeProduct = async (req, res) => {
  try {
    const { id, productId } = req.params;

    await CollectionProduct.destroy({
      where: { collectionId: id, productId }
    });

    res.json({
      success: true,
      message: 'Producto eliminado de la colección'
    });
  } catch (error) {
    console.error('Error removing product from collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto'
    });
  }
};

// Reorder products in collection
exports.reorderProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { productIds } = req.body;

    // Update sort order for each product
    for (let i = 0; i < productIds.length; i++) {
      await CollectionProduct.update(
        { sortOrder: i },
        { where: { collectionId: id, productId: productIds[i] } }
      );
    }

    const updated = await Collection.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        through: { attributes: ['sortOrder'] }
      }]
    });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error reordering products:', error);
    res.status(500).json({
      success: false,
      message: 'Error al reordenar productos'
    });
  }
};

// Delete collection
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Colección no encontrada'
      });
    }

    // Delete collection products first
    await CollectionProduct.destroy({ where: { collectionId: id } });
    
    // Delete collection
    await collection.destroy();

    res.json({
      success: true,
      message: 'Colección eliminada'
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar colección'
    });
  }
};
