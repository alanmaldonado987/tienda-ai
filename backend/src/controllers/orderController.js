const orderService = require('../services/orderService');

/**
 * Crear orden desde el carrito
 */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await orderService.createFromCart(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: order
    });
  } catch (error) {
    console.error('Error al crear orden:', error);
    const status = error.message.includes('vacío') || error.message.includes('requeridos') ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener orden por ID
 */
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getById(id);

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a esta orden'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    const status = error.message === 'Orden no encontrada' ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener historial de órdenes del usuario
 */
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getUserOrders(userId);

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener todas las órdenes (admin)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const orders = await orderService.getAllOrders({ status });

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Actualizar estado de orden (admin)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Estado es requerido'
      });
    }

    const order = await orderService.updateStatus(id, status);

    res.json({
      success: true,
      message: 'Estado actualizado',
      data: order
    });
  } catch (error) {
    const status = error.message === 'Orden no encontrada' ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Cancelar orden
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const order = await orderService.getById(id);

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a esta orden'
      });
    }

    const updated = await orderService.cancelOrder(id, reason);

    res.json({
      success: true,
      message: 'Orden cancelada',
      data: updated
    });
  } catch (error) {
    const status = error.message === 'Orden no encontrada' ? 404 : 400;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};
