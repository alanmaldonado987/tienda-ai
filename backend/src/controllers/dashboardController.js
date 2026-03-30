const { Op } = require('sequelize');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');

/**
 * Obtener estadísticas del dashboard
 */
exports.getStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);
    
    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);
    
    // Ventas de hoy
    const todayOrders = await Order.findAll({
      where: {
        status: 'paid',
        createdAt: { [Op.gte]: today }
      }
    });
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const todayOrdersCount = todayOrders.length;
    
    // Ventas últimos 7 días
    const weekOrders = await Order.findAll({
      where: {
        status: 'paid',
        createdAt: { [Op.gte]: last7Days }
      }
    });
    const weekRevenue = weekOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const weekOrdersCount = weekOrders.length;
    
    // Ventas últimos 30 días
    const monthOrders = await Order.findAll({
      where: {
        status: 'paid',
        createdAt: { [Op.gte]: last30Days }
      }
    });
    const monthRevenue = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const monthOrdersCount = monthOrders.length;
    
    // Total productos
    const totalProducts = await Product.count();
    
    // Productos con stock bajo
    const lowStockProducts = await Product.count({
      where: require('sequelize').literal('stock <= "low_stock_threshold"')
    });
    
    // Total usuarios
    const totalUsers = await User.count();
    
    // Órdenes pendientes
    const pendingOrders = await Order.count({
      where: {
        status: ['pending_payment', 'pending']
      }
    });
    
    // Órdenes por estado
    const ordersByStatus = await Order.findAll({
      attributes: ['status', [require('sequelize').fn('COUNT', require('sequelize').col('status')), 'count']],
      group: ['status'],
      raw: true
    });
    
    // Top productos vendidos (últimos 30 días)
    const topProducts = await Order.findAll({
      attributes: {
        include: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'orderCount']]
      },
      where: {
        createdAt: { [Op.gte]: last30Days }
      },
      group: ['Order.id'],
      limit: 5,
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']]
    });
    
    res.json({
      success: true,
      data: {
        overview: {
          todayOrders: todayOrdersCount,
          todayRevenue,
          weekOrders: weekOrdersCount,
          weekRevenue,
          monthOrders: monthOrdersCount,
          monthRevenue,
          totalProducts,
          totalUsers,
          lowStockProducts,
          pendingOrders
        },
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count);
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener gráfica de ventas (últimos 30 días)
 */
exports.getSalesChart = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const orders = await Order.findAll({
      where: {
        status: 'paid',
        createdAt: { [Op.gte]: startDate }
      },
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('SUM', require('sequelize').col('total')), 'revenue'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'orders']
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']],
      raw: true
    });
    
    // Llenar días sin ventas
    const chartData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const found = orders.find(o => o.date === dateStr);
      chartData.push({
        date: dateStr,
        revenue: found ? parseInt(found.revenue) || 0 : 0,
        orders: found ? parseInt(found.orders) || 0 : 0
      });
    }
    
    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
