const cartService = require('../services/cartService');

/**
 * Obtener carrito del usuario
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({
      success: false,
      message: error.message
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

    const result = await cartService.addItem(userId, {
      productId,
      quantity,
      selectedColor,
      selectedSize
    });

    res.status(201).json({
      success: true,
      message: 'Producto agregado al carrito',
      data: result
    });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    const status = error.message.includes('no encontrado') ? 404 : 
                   error.message.includes('stock') ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message
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

    const result = await cartService.updateItem(userId, {
      productId,
      quantity,
      selectedColor,
      selectedSize
    });

    res.json({
      success: true,
      message: 'Carrito actualizado',
      data: result
    });
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    const status = error.message.includes('inválida') || error.message.includes('stock') ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message
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

    const result = await cartService.removeItem(userId, {
      productId,
      selectedColor,
      selectedSize
    });

    res.json({
      success: true,
      message: 'Producto removido del carrito',
      data: result
    });
  } catch (error) {
    console.error('Error al quitar del carrito:', error);
    const status = error.message.includes('no encontrado') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Limpiar carrito completo
 */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await cartService.clearCart(userId);

    res.json({
      success: true,
      message: 'Carrito vaciado',
      data: result
    });
  } catch (error) {
    console.error('Error al limpiar carrito:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
