const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

/**
 * Obtener carrito del usuario
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await CartItem.getCart(userId);

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        items: cart,
        subtotal,
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener carrito'
    });
  }
};

/**
 * Agregar item al carrito
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'No hay suficiente stock disponible'
      });
    }

    const item = await CartItem.addItem(userId, productId, quantity, selectedColor, selectedSize);
    
    // Obtener carrito actualizado
    const cart = await CartItem.getCart(userId);
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    res.status(201).json({
      success: true,
      message: 'Producto agregado al carrito',
      data: {
        items: cart,
        subtotal,
        totalItems: cart.reduce((sum, i) => sum + i.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al agregar al carrito'
    });
  }
};

/**
 * Actualizar cantidad de un item
 */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, selectedColor, selectedSize } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Cantidad inválida'
      });
    }

    // Si cantidad es 0, eliminar el item
    if (quantity === 0) {
      await CartItem.removeItem(userId, productId, selectedColor, selectedSize);
    } else {
      // Verificar stock
      const product = await Product.findByPk(productId);
      if (product && product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'No hay suficiente stock disponible'
        });
      }

      await CartItem.updateQuantity(userId, productId, quantity, selectedColor, selectedSize);
    }

    // Obtener carrito actualizado
    const cart = await CartItem.getCart(userId);
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    res.json({
      success: true,
      message: 'Carrito actualizado',
      data: {
        items: cart,
        subtotal,
        totalItems: cart.reduce((sum, i) => sum + i.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar carrito'
    });
  }
};

/**
 * Quitar item del carrito
 */
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { selectedColor, selectedSize } = req.query;

    const removed = await CartItem.removeItem(userId, productId, selectedColor, selectedSize);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado en el carrito'
      });
    }

    // Obtener carrito actualizado
    const cart = await CartItem.getCart(userId);
    const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    res.json({
      success: true,
      message: 'Producto removido del carrito',
      data: {
        items: cart,
        subtotal,
        totalItems: cart.reduce((sum, i) => sum + i.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error al quitar del carrito:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al quitar del carrito'
    });
  }
};

/**
 * Limpiar carrito completo
 */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await CartItem.clearCart(userId);

    res.json({
      success: true,
      message: 'Carrito vaciado',
      data: {
        items: [],
        subtotal: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    console.error('Error al limpiar carrito:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al limpiar carrito'
    });
  }
};
