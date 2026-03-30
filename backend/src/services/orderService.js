/**
 * Order Service - Lógica de negocio para pedidos
 */
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const sequelize = require('../config/database');

class OrderService {
  /**
   * Crear orden desde el carrito
   * @param {string} userId - ID del usuario
   * @param {Object} orderData - Datos de la orden
   * @returns {Promise<Object>}
   */
  async createFromCart(userId, orderData) {
    const { 
      shippingName, 
      shippingEmail, 
      shippingPhone, 
      shippingAddress, 
      shippingCity, 
      shippingDepartment,
      shippingZipCode,
      shippingNotes,
      paymentMethod
    } = orderData;

    // Validar datos requeridos
    if (!shippingName || !shippingEmail || !shippingPhone || !shippingAddress || !shippingCity || !shippingDepartment) {
      throw new Error('Todos los campos de envío son requeridos');
    }

    // Obtener items del carrito
    const cartItems = await CartItem.getCart(userId);
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Calcular totales
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Costo de envío (gratis si es mayor a X amount)
    const freeShippingThreshold = 150000; // $150,000 COP
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 12000;
    
    // Impuestos (19% VAT en Colombia)
    const tax = Math.round(subtotal * 0.19);
    
    const total = subtotal + shippingCost + tax;

    // Crear la orden
    const order = await Order.create({
      userId,
      orderNumber: Order.generateOrderNumber(),
      subtotal,
      shippingCost,
      tax,
      total,
      shippingName,
      shippingEmail,
      shippingPhone,
      shippingAddress,
      shippingCity,
      shippingDepartment,
      shippingZipCode,
      shippingNotes,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending',
      status: 'pending'
    });

    // Crear los items de la orden
    for (const item of cartItems) {
      // Normalizar: obtener primera imagen del array o usar el campo image directamente
      const productImage = Array.isArray(item.images) 
        ? item.images[0] 
        : item.image || 'https://via.placeholder.com/400x533?text=No+Image';
      
      await OrderItem.create({
        orderId: order.id,
        productId: item.id,
        productName: item.name,
        productImage: productImage,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      });

      // Reducir stock del producto - query SQL directa
      await sequelize.query(
        'UPDATE products SET stock = GREATEST(0, stock - :quantity) WHERE id = :productId',
        { replacements: { quantity: item.quantity, productId: item.id } }
      );
    }

    // Limpiar el carrito
    await CartItem.clearCart(userId);

    // Retornar orden con items
    return this.getById(order.id);
  }

  /**
   * Obtener orden por ID
   * @param {string} id - ID de la orden
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const order = await Order.findByPk(id);
    
    if (!order) {
      throw new Error('Orden no encontrada');
    }
    
    // Obtener items manualmente
    const items = await OrderItem.findAll({ where: { orderId: id } });
    
    // Agregar items al objeto orden
    order.dataValues.items = items;
    
    return order;
  }

  /**
   * Obtener todas las órdenes del usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>}
   */
  async getUserOrders(userId) {
    return await Order.findAllOrders({ userId });
  }

  /**
   * Obtener todas las órdenes (admin)
   * @param {Object} filters - Filtros (status, etc)
   * @returns {Promise<Array>}
   */
  async getAllOrders(filters = {}) {
    return await Order.findAllOrders(filters);
  }

  /**
   * Actualizar estado de la orden
   * @param {string} id - ID de la orden
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    return await Order.updateStatus(id, status);
  }

  /**
   * Cancelar orden
   * @param {string} id - ID de la orden
   * @param {string} reason - Razón de cancelación
   * @returns {Promise<Object>}
   */
  async cancelOrder(id, reason) {
    const order = await Order.findByPk(id);
    
    if (!order) {
      throw new Error('Orden no encontrada');
    }

    if (order.status !== 'pending' && order.status !== 'processing') {
      throw new Error('No se puede cancelar esta orden');
    }

    // Restaurar stock - query SQL directa
    const items = await OrderItem.findAll({ where: { orderId: id } });
    for (const item of items) {
      await sequelize.query(
        'UPDATE products SET stock = stock + :quantity WHERE id = :productId',
        { replacements: { quantity: item.quantity, productId: item.productId } }
      );
    }

    return await order.update({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancellationReason: reason
    });
  }
}

module.exports = new OrderService();
