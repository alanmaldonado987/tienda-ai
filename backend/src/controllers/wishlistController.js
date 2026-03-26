const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

/**
 * Obtener wishlist del usuario
 */
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await Wishlist.getUserFavorites(userId);

    res.json({
      success: true,
      data: favorites,
      count: favorites.length
    });
  } catch (error) {
    console.error('Error al obtener wishlist:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener favoritos'
    });
  }
};

/**
 * Agregar producto a wishlist
 */
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const { favorite, isNew } = await Wishlist.addFavorite(userId, productId);

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew ? 'Producto agregado a favoritos' : 'Producto ya está en favoritos',
      data: product
    });
  } catch (error) {
    console.error('Error al agregar a wishlist:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al agregar a favoritos'
    });
  }
};

/**
 * Quitar producto de wishlist
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const removed = await Wishlist.removeFavorite(userId, productId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Producto no estaba en favoritos'
      });
    }

    res.json({
      success: true,
      message: 'Producto removido de favoritos'
    });
  } catch (error) {
    console.error('Error al quitar de wishlist:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al quitar de favoritos'
    });
  }
};

/**
 * Toggle favorito (agregar/quitar)
 */
exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const result = await Wishlist.toggleFavorite(userId, productId);

    res.json({
      success: true,
      message: result.action === 'added' 
        ? 'Producto agregado a favoritos' 
        : 'Producto removido de favoritos',
      data: {
        isFavorite: result.isFavorite,
        product
      }
    });
  } catch (error) {
    console.error('Error al toggle wishlist:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar favoritos'
    });
  }
};
