const wishlistService = require('../services/wishlistService');

/**
 * Obtener wishlist del usuario
 */
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await wishlistService.getWishlist(userId);

    res.json({
      success: true,
      data: favorites,
      count: favorites.length
    });
  } catch (error) {
    console.error('Error al obtener wishlist:', error);
    res.status(500).json({
      success: false,
      message: error.message
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

    const result = await wishlistService.addItem(userId, productId);

    res.status(result.isNew ? 201 : 200).json({
      success: true,
      message: result.message,
      data: result.product
    });
  } catch (error) {
    console.error('Error al agregar a wishlist:', error);
    const status = error.message.includes('no encontrado') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
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

    const result = await wishlistService.removeItem(userId, productId);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error al quitar de wishlist:', error);
    const status = error.message.includes('no estaba') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
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

    const result = await wishlistService.toggleItem(userId, productId);

    res.json({
      success: true,
      message: result.message,
      data: {
        isFavorite: result.isFavorite,
        product: result.product
      }
    });
  } catch (error) {
    console.error('Error al toggle wishlist:', error);
    const status = error.message.includes('no encontrado') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};
