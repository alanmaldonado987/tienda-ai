import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Truck, 
  CreditCard, 
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Phone,
  Mail,
  FileText,
  Banknote,
  Package,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { ordersAPI, paymentAPI } from '../services/api';

const STEPS = [
  { id: 1, name: 'Carrito' },
  { id: 2, name: 'Envío' },
  { id: 3, name: 'Pago' },
  { id: 4, name: 'Listo' }
];

const COLOMBIA_DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
  'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
  'Quindío', 'Risaralda', 'San Andrés', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada'
];

const PAYMENT_METHODS = [
  { id: 'mercadopago', name: 'MercadoPago', description: 'Tarjeta, PSE, efectivo - Pago seguro e instantáneo' },
  { id: 'cash', name: 'Pago contra entrega', description: 'Paga cuando recibas' },
  { id: 'transfer', name: 'Transferencia bancaria', description: 'Te enviamos datos' }
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(null);
  const [direction, setDirection] = useState(1);
  
  const [shippingData, setShippingData] = useState({
    shippingName: user?.name || '',
    shippingEmail: user?.email || '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingDepartment: '',
    shippingZipCode: '',
    shippingNotes: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const freeShippingThreshold = 150000;
  const shippingCost = cartTotal >= freeShippingThreshold ? 0 : 12000;
  const tax = Math.round(cartTotal * 0.19);
  const orderTotal = cartTotal + shippingCost + tax;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (cart.length === 0 && currentStep < 4) {
      navigate('/');
      return;
    }
  }, [user, cart, navigate, currentStep]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const canProceedToStep = (step) => {
    if (step === 2) return true;
    if (step === 3) {
      return shippingData.shippingName && shippingData.shippingEmail && 
             shippingData.shippingPhone && shippingData.shippingAddress &&
             shippingData.shippingCity && shippingData.shippingDepartment;
    }
    if (step === 4) return paymentMethod;
    return true;
  };

  const nextStep = () => {
    const next = currentStep + 1;
    if (next <= 4 && canProceedToStep(next)) {
      setDirection(1);
      setCurrentStep(next);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step < currentStep) {
      setDirection(step < currentStep ? -1 : 1);
      setCurrentStep(step);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Preparar datos de la orden
      const orderData = {
        ...shippingData,
        paymentMethod
      };

      // Primero crear la orden en el backend
      const orderResponse = await ordersAPI.create(orderData);
      const order = orderResponse.data.data;
      
      // Si es MercadoPago, crear preferencia y redireccionar
      if (paymentMethod === 'mercadopago') {
        // Preparar items para MercadoPago
        const mpItems = cart.map(item => ({
          id: item.id,
          name: item.name,
          description: item.selectedColor && item.selectedSize 
            ? `Color: ${item.selectedColor}, Talla: ${item.selectedSize}`
            : item.description || '',
          quantity: item.quantity,
          price: item.price,
          productId: item.id
        }));

        // Crear preferencia de pago
        const prefResponse = await paymentAPI.createPreference({
          orderId: order.id,
          items: mpItems,
          payer: {
            name: shippingData.shippingName,
            email: shippingData.shippingEmail
          },
          totalAmount: orderTotal
        });

        const { initPoint, sandboxInitPoint } = prefResponse.data.data;
        
        // Usar sandbox en desarrollo, producción en prod
        const isDev = import.meta.env.DEV || !import.meta.env.PROD;
        const paymentUrl = isDev ? sandboxInitPoint : initPoint;

        if (paymentUrl) {
          // Limpiar carrito y redireccionar a MercadoPago
          await clearCart();
          window.location.href = paymentUrl;
          return;
        }
      }

      // Para otros métodos (cash, transfer), mostrar confirmación
      setOrderCreated(order);
      await clearCart();
      setDirection(1);
      setCurrentStep(4);
      showToast('Orden creada exitosamente', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al crear orden', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const pageVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0
    })
  };

  // Step 1: Cart Review
  const renderCartStep = () => (
    <motion.div
      key="cart"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-medium mb-4">Revisa tu carrito</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-naf-gray mb-4">Tu carrito esta vacio</p>
          <button 
            onClick={() => navigate('/')}
            className="text-naf-black underline"
          >
            Volver a la tienda
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 bg-white p-3 rounded-lg border border-gray-200"
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="text-xs text-naf-gray">
                    {item.selectedColor && `Color: ${item.selectedColor}`}
                    {item.selectedSize && ` | Talla: ${item.selectedSize}`}
                  </p>
                  <p className="text-xs">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-naf-gray">Subtotal ({cart.reduce((a, i) => a + i.quantity, 0)} items)</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-naf-gray">Envio</span>
              <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
              </span>
            </div>
            {cartTotal < freeShippingThreshold && (
              <p className="text-xs text-green-600 mb-2">
                Agrega {formatPrice(freeShippingThreshold - cartTotal)} mas para envio gratis
              </p>
            )}
            <div className="flex justify-between text-sm mb-2">
              <span className="text-naf-gray">Impuesto (19%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-naf-black">{formatPrice(orderTotal)}</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );

  // Step 2: Shipping
  const renderShippingStep = () => (
    <motion.div
      key="shipping"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-medium mb-4">Informacion de envio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Nombre completo *</label>
          <div className="relative">
            <input
              type="text"
              name="shippingName"
              value={shippingData.shippingName}
              onChange={handleShippingChange}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naf-black"
              placeholder="Juan Perez"
              required
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-naf-gray" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="shippingEmail"
            value={shippingData.shippingEmail}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naf-black"
            placeholder="juan@email.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Telefono *</label>
          <input
            type="tel"
            name="shippingPhone"
            value={shippingData.shippingPhone}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naf-black"
            placeholder="300 123 4567"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Direccion *</label>
          <input
            type="text"
            name="shippingAddress"
            value={shippingData.shippingAddress}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naf-black"
            placeholder="Carrera 10 # 20-30"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Ciudad *</label>
          <input
            type="text"
            name="shippingCity"
            value={shippingData.shippingCity}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naf-black"
            placeholder="Bogota"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Departamento *</label>
          <select
            name="shippingDepartment"
            value={shippingData.shippingDepartment}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naf-black bg-white"
            required
          >
            <option value="">Selecciona</option>
            {COLOMBIA_DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Notas</label>
          <textarea
            name="shippingNotes"
            value={shippingData.shippingNotes}
            onChange={handleShippingChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naf-black"
            placeholder="Instrucciones especiales..."
            rows={2}
          />
        </div>
      </div>
    </motion.div>
  );

  // Step 3: Payment
  const renderPaymentStep = () => (
    <motion.div
      key="payment"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-medium mb-4">Metodo de pago</h2>
      
      <div className="space-y-2">
        {PAYMENT_METHODS.map((method, index) => (
          <motion.label
            key={method.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              paymentMethod === method.id 
                ? 'border-naf-black bg-gray-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div>
              <p className="font-medium text-sm">{method.name}</p>
              <p className="text-xs text-naf-gray">{method.description}</p>
            </div>
          </motion.label>
        ))}
      </div>
      
      <div className="bg-gray-50 p-3 rounded-lg">
        <h3 className="font-medium text-sm mb-2">Resumen</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-naf-gray">Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-naf-gray">Envio</span>
            <span className={shippingCost === 0 ? 'text-green-600' : ''}>
              {shippingCost === 0 ? 'GRATIS' : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-naf-gray">Impuesto</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between font-medium border-t pt-1 mt-1">
            <span>Total</span>
            <span>{formatPrice(orderTotal)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Step 4: Confirmation
  const renderConfirmationStep = () => (
    <motion.div
      key="confirmation"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-6"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 250 }}
        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <CheckCircle className="w-10 h-10 text-green-600" />
      </motion.div>
      
      <h2 className="text-xl font-semibold text-green-600 mb-2">Pedido confirmado</h2>
      <p className="text-naf-gray text-sm mb-4">
        Tu orden ha sido creada exitosamente.
      </p>
      
      {orderCreated && (
        <div className="bg-gray-50 p-4 rounded-lg text-left max-w-sm mx-auto mb-4">
          <p className="text-xs text-naf-gray">Numero de orden</p>
          <p className="font-mono font-medium">{orderCreated.orderNumber}</p>
          
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-naf-gray">Total</p>
            <p className="font-medium">{formatPrice(orderCreated.total)}</p>
          </div>
        </div>
      )}
      
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 bg-naf-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Mis pedidos
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Continuar comprando
        </button>
      </div>
    </motion.div>
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Checkout</h1>
        </div>

        {/* Simple Stepper */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    currentStep >= step.id 
                      ? 'bg-naf-black text-white' 
                      : 'bg-gray-200 text-naf-gray'
                  } ${step.id <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </button>
                <span className={`ml-2 text-xs hidden sm:inline ${
                  currentStep >= step.id ? 'text-naf-black font-medium' : 'text-naf-gray'
                }`}>
                  {step.name}
                </span>
                {index < STEPS.length - 1 && (
                  <div className={`w-6 sm:w-10 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-naf-black' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
            >
              {currentStep === 1 && renderCartStep()}
              {currentStep === 2 && renderShippingStep()}
              {currentStep === 3 && renderPaymentStep()}
              {currentStep === 4 && renderConfirmationStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-4">
            <button
              onClick={currentStep === 1 ? () => navigate('/') : prevStep}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 1 ? 'Tienda' : 'Atras'}
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={!canProceedToStep(currentStep + 1)}
                className="px-6 py-2 bg-naf-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                Continuar
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Banknote className="w-4 h-4" />
                    Ordenar ({formatPrice(orderTotal)})
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
