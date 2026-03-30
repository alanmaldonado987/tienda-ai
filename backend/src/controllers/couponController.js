const Coupon = require('../models/Coupon');

/**
 * Obtener todos los cupones (admin)
 */
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: coupons,
      count: coupons.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener cupones activos (público)
 */
exports.getActiveCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findActive();
    
    res.json({
      success: true,
      data: coupons,
      count: coupons.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener cupón por ID
 */
exports.getCouponById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Cupón no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Crear cupón (admin)
 */
exports.createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxUses,
      perUserLimit,
      startsAt,
      expiresAt
    } = req.body;
    
    if (!code || !discountType || !discountValue) {
      return res.status(400).json({
        success: false,
        message: 'Código, tipo de descuento y valor son requeridos'
      });
    }
    
    // Validaciones
    if (discountType === 'percentage' && (discountValue < 1 || discountValue > 100)) {
      return res.status(400).json({
        success: false,
        message: 'El porcentaje debe estar entre 1 y 100'
      });
    }
    
    if (discountType === 'fixed' && discountValue < 1) {
      return res.status(400).json({
        success: false,
        message: 'El valor fijo debe ser mayor a 0'
      });
    }
    
    // Verificar código único
    const existing = await Coupon.findOne({ where: { code: code.toUpperCase() } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un cupón con este código'
      });
    }
    
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minPurchase: minPurchase || 0,
      maxUses,
      perUserLimit: perUserLimit || 1,
      startsAt,
      expiresAt,
      isActive: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Cupón creado exitosamente',
      data: coupon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Actualizar cupón (admin)
 */
exports.updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      description,
      discountType,
      discountValue,
      minPurchase,
      maxUses,
      perUserLimit,
      startsAt,
      expiresAt,
      isActive
    } = req.body;
    
    const coupon = await Coupon.findByPk(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Cupón no encontrado'
      });
    }
    
    // Validaciones
    if (discountType === 'percentage' && discountValue && (discountValue < 1 || discountValue > 100)) {
      return res.status(400).json({
        success: false,
        message: 'El porcentaje debe estar entre 1 y 100'
      });
    }
    
    if (discountType === 'fixed' && discountValue && discountValue < 1) {
      return res.status(400).json({
        success: false,
        message: 'El valor fijo debe ser mayor a 0'
      });
    }
    
    await coupon.update({
      description: description !== undefined ? description : coupon.description,
      discountType: discountType || coupon.discountType,
      discountValue: discountValue || coupon.discountValue,
      minPurchase: minPurchase !== undefined ? minPurchase : coupon.minPurchase,
      maxUses: maxUses !== undefined ? maxUses : coupon.maxUses,
      perUserLimit: perUserLimit || coupon.perUserLimit,
      startsAt: startsAt !== undefined ? startsAt : coupon.startsAt,
      expiresAt: expiresAt !== undefined ? expiresAt : coupon.expiresAt,
      isActive: isActive !== undefined ? isActive : coupon.isActive
    });
    
    res.json({
      success: true,
      message: 'Cupón actualizado exitosamente',
      data: coupon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Eliminar cupón (admin)
 */
exports.deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findByPk(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Cupón no encontrado'
      });
    }
    
    await coupon.destroy();
    
    res.json({
      success: true,
      message: 'Cupón eliminado exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Validar cupón (público - para checkout)
 */
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, purchaseAmount } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'El código del cupón es requerido'
      });
    }
    
    const coupon = await Coupon.findByCode(code);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Cupón no encontrado o inactivo'
      });
    }
    
    // Validar para usar
    const validation = coupon.validateForUse(null, purchaseAmount || 0);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }
    
    // Calcular descuento
    const discount = coupon.calculateDiscount(purchaseAmount || 0);
    
    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        calculatedDiscount: discount,
        minPurchase: coupon.minPurchase,
        description: coupon.description
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
