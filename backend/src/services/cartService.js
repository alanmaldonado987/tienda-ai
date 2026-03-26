/**
 * Cart Service - Lógica de negocio para el carrito
 */
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

class CartService {
  /**
   * Obtener carrito del usuario con totales
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getCart(userId) {
    const cart = await CartItem.getCart(userId);
    
    const subtotal = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: cart,
      subtotal,
      totalItems
    };
  }

  /**
   * Agregar item al carrito
   * @param {string} userId - ID del usuario
   * @param {Object} data - Datos del item (productId, quantity, selectedColor, selectedSize)
   * @returns {Promise<Object>}
   */
  async addItem(userId, { productId, quantity = 1, selectedColor, selectedSize }) {
    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Verificar stock
    if (product.stock < quantity) {
      throw new Error('No hay suficiente stock disponible');
    }

    // Agregar al carrito
    await CartItem.addItem(userId, productId, quantity, selectedColor, selectedSize);
    
    // Retornar carrito actualizado
    return this.getCart(userId);
  }

  /**
   * Actualizar cantidad de un item
   * @param {string} userId - ID del usuario
   * @param {Object} data - Datos (productId, quantity, selectedColor, selectedSize)
   * @returns {Promise<Object>}
   */
  async updateItem(userId, { productId, quantity, selectedColor, selectedSize }) {
    if (quantity === undefined || quantity < 0) {
      throw new Error('Cantidad inválida');
    }

    // Si cantidad es 0, eliminar el item
    if (quantity === 0) {
      await CartItem.removeItem(userId, productId, selectedColor, selectedSize);
    } else {
      // Verificar stock
      const product = await Product.findByPk(productId);
      if (product && product.stock < quantity) {
        throw new Error('No hay suficiente stock disponible');
      }

      await CartItem.updateQuantity(userId, productId, quantity, selectedColor, selectedSize);
    }

    return this.getCart(userId);
  }

  /**
   * Quitar item del carrito
   * @param {string} userId - ID del usuario
   * @param {Object} data - Datos (productId, selectedColor, selectedSize)
   * @returns {Promise<Object>}
   */
  async removeItem(userId, { productId, selectedColor, selectedSize }) {
    const removed = await CartItem.removeItem(userId, productId, selectedColor, selectedSize);
    
    if (!removed) {
      throw new Error('Item no encontrado en el carrito');
    }

    return this.getCart(userId);
  }

  /**
   * Limpiar carrito completo
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async clearCart(userId) {
    await CartItem.clearCart(userId);
    
    return {
      items: [],
      subtotal: 0,
      totalItems: 0
    };
  }
}

module.exports = new CartService();
