/**
 * MercadoPago Service - Integración con Checkout Pro
 */
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

class MercadoPagoService {
  constructor() {
    this.client = null;
    this.preference = null;
    this.payment = null;
    this.initialized = false;
  }

  /**
   * Inicializar cliente de MercadoPago
   */
  init() {
    if (this.initialized) return;

    const accessToken = process.env.MP_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.warn('⚠️  MP_ACCESS_TOKEN no configurado - MercadoPago no funcionará');
      return;
    }

    this.client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 }
    });

    this.preference = new Preference(this.client);
    this.payment = new Payment(this.client);
    this.initialized = true;

    console.log('💳 MercadoPago inicializado');
  }

  /**
   * Crear preferencia de pago (Checkout Pro)
   * @param {Object} orderData
   * @returns {Promise<Object>} preferenceId y URLs
   */
  async createPreference(orderData) {
    this.init();

    if (!this.initialized) {
      throw new Error('MercadoPago no está configurado');
    }

    const { orderId, items, payer, totalAmount } = orderData;

    const preference = {
      items: items.map(item => ({
        id: item.productId || item.id,
        title: item.name || item.title,
        description: item.description || '',
        quantity: item.quantity,
        unit_price: Number(item.price || item.unit_price),
        currency_id: 'COP'
      })),
      
      payer: {
        name: payer.name || '',
        email: payer.email
      },

      // URLs de redirección después del pago
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment?status=success&order=${orderId}`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment?status=failure&order=${orderId}`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment?status=pending&order=${orderId}`
      },
      auto_return: 'approved',

      // Webhook para notificaciones
      notification_url: process.env.MP_NOTIFICATION_URL || 
        `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payments/webhook`,

      // Metadata de tu orden
      external_reference: orderId,

      // Configuración del checkout
      payment_methods: {
        installments: 12 // Máximo de cuotas
      },

      // Expiración (24 horas)
      expires: true,
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    try {
      const result = await this.preference.create({ body: preference });
      
      console.log('✅ Preferencia MP creada:', result.id);

      return {
        preferenceId: result.id,
        initPoint: result.init_point,           // URL producción
        sandboxInitPoint: result.sandbox_init_point // URL sandbox/dev
      };
    } catch (error) {
      console.error('❌ Error creando preferencia MP:', error);
      throw new Error('Error al crear preferencia de pago');
    }
  }

  /**
   * Obtener detalles de un pago
   * @param {string} paymentId - ID del pago en MP
   * @returns {Promise<Object>}
   */
  async getPayment(paymentId) {
    this.init();

    if (!this.initialized) {
      throw new Error('MercadoPago no está configurado');
    }

    try {
      const payment = await this.payment.get({ id: paymentId });
      
      return {
        id: payment.id,
        status: payment.status,
        statusDetail: payment.status_detail,
        transactionAmount: payment.transaction_amount,
        currencyId: payment.currency_id,
        paymentMethodId: payment.payment_method_id,
        paymentTypeId: payment.payment_type_id,
        externalReference: payment.external_reference, // Tu orderId
        dateApproved: payment.date_approved,
        dateCreated: payment.date_created,
        payerEmail: payment.payer?.email,
        Installments: payment.installments
      };
    } catch (error) {
      console.error('❌ Error obteniendo pago MP:', error);
      throw new Error('Error al obtener detalles del pago');
    }
  }

  /**
   * Verificar si un pago fue aprobado
   * @param {string} paymentId
   * @returns {Promise<boolean>}
   */
  async isPaymentApproved(paymentId) {
    const payment = await this.getPayment(paymentId);
    return payment.status === 'approved';
  }

  /**
   * Manejar notificación de webhook
   * @param {Object} body - Body del webhook
   * @returns {Promise<Object>}
   */
  async handleWebhook(body) {
    const { type, data } = body;

    if (type === 'payment') {
      const paymentId = data.id;
      return await this.getPayment(paymentId);
    }

    if (type === 'merchant_order') {
      // Merchant order contiene info de los pagos asociados
      // Útil para órdenes con múltiples pagos
      console.log('📦 Merchant order notification:', data.id);
      return { type: 'merchant_order', id: data.id };
    }

    return { type, data };
  }
}

module.exports = new MercadoPagoService();
