const mercadopagoService = require('../services/mercadopagoService');
const Order = require('../models/Order');

/**
 * Crear preferencia de pago (iniciar checkout)
 */
exports.createPreference = async (req, res, next) => {
  try {
    const { orderId, items, payer, totalAmount } = req.body;

    if (!orderId || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'orderId e items son requeridos'
      });
    }

    // Verificar que la orden existe
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Crear preferencia en MercadoPago
    const result = await mercadopagoService.createPreference({
      orderId,
      items,
      payer: payer || { email: req.user?.email },
      totalAmount
    });

    // Actualizar orden con preferenceId
    await order.update({
      mpPreferenceId: result.preferenceId
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error en createPreference:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear preferencia de pago'
    });
  }
};

/**
 * Webhook de MercadoPago
 * Recibe notificaciones de pagos
 */
exports.webhook = async (req, res, next) => {
  try {
    const { type, data, id } = req.body;

    console.log('📬 Webhook MP recibido:', { type, id });

    // MercadoPago envía una notificación de prueba al configurar
    if (req.query.test === 'true') {
      console.log('🧪 Webhook de test recibido');
      return res.status(200).json({ received: true });
    }

    // Procesar según el tipo
    if (type === 'payment') {
      const paymentData = await mercadopagoService.handleWebhook(req.body);
      
      if (paymentData.status) {
        const orderId = paymentData.externalReference;
        
        if (orderId) {
          // Actualizar estado de la orden
          await Order.update(
            {
              mpPaymentId: paymentData.id,
              mpStatus: paymentData.status,
              mpStatusDetail: paymentData.statusDetail,
              mpPaymentMethod: paymentData.paymentMethodId,
              paidAt: paymentData.status === 'approved' ? new Date() : null,
              status: paymentData.status === 'approved' ? 'paid' : 
                      paymentData.status === 'rejected' ? 'cancelled' : 'pending_payment'
            },
            { where: { id: orderId } }
          );
          
          console.log(`✅ Orden ${orderId} actualizada: ${paymentData.status}`);
        }
      }
    }

    // Siempre responder 200 para que MP no reintente
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    // Aún así responder 200 para no generar reintentos
    res.status(200).json({ received: true, error: error.message });
  }
};

/**
 * Obtener estado del pago
 */
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        mpStatus: order.mpStatus,
        mpStatusDetail: order.mpStatusDetail,
        mpPaymentId: order.mpPaymentId,
        mpPaymentMethod: order.mpPaymentMethod,
        paidAt: order.paidAt,
        total: order.total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener estado del pago'
    });
  }
};

/**
 * Verificar pago manualmente (por si webhook falla)
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    if (!order.mpPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'No hay pago asociado a esta orden'
      });
    }

    // Consultar estado actual en MP
    const paymentData = await mercadopagoService.getPayment(order.mpPaymentId);

    // Actualizar orden con estado actual
    await order.update({
      mpStatus: paymentData.status,
      mpStatusDetail: paymentData.statusDetail,
      paidAt: paymentData.status === 'approved' ? new Date() : order.paidAt,
      status: paymentData.status === 'approved' ? 'paid' : 
              paymentData.status === 'rejected' ? 'cancelled' : order.status
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        mpStatus: paymentData.status,
        mpStatusDetail: paymentData.statusDetail,
        verified: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error al verificar pago'
    });
  }
};
