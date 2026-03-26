/**
 * Wishlist Service - Lógica de negocio para wishlist/favoritos
 */
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

class WishlistService {
  /**
   * Obtener wishlist del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>}
   */
  async getWishlist(userId) {
    return await Wishlist.getUserFavorites(userId);
  }

  /**
   * Agregar producto a wishlist
   * @param {string} userId - ID del usuario
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>}
   */
  async addItem(userId, productId) {
    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const { favorite, isNew } = await Wishlist.addFavorite(userId, productId);
    
    return {
      product,
      isNew,
      message: isNew ? 'Producto agregado a favoritos' : 'Producto ya está en favoritos'
    };
  }

  /**
   * Quitar producto de wishlist
   * @param {string} userId - ID del usuario
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>}
   */
  async removeItem(userId, productId) {
    const removed = await Wishlist.removeFavorite(userId, productId);
    
    if (!removed) {
      throw new Error('Producto no estaba en favoritos');
    }

    return { message: 'Producto removido de favoritos' };
  }

  /**
   * Toggle favorito (agregar/quitar)
   * @param {string} userId - ID del usuario
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>}
   */
  async toggleItem(userId, productId) {
    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const result = await Wishlist.toggleFavorite(userId, productId);

    return {
      product,
      isFavorite: result.isFavorite,
      action: result.action,
      message: result.action === 'added' 
        ? 'Producto agregado a favoritos' 
        : 'Producto removido de favoritos'
    };
  }
}

module.exports = new WishlistService();
