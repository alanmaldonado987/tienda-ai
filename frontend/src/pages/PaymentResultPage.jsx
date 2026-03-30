import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ShoppingBag, Home, RefreshCw } from 'lucide-react';
import { ordersAPI, paymentAPI } from '../services/api';
import { useConfig } from '../context/ConfigContext';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { config: appConfig } = useConfig();
  const appName = appConfig.app_name;
  
  const status = searchParams.get('status'); // success, failure, pending
  const orderId = searchParams.get('order');
  const paymentId = searchParams.get('payment_id');
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  // Obtener info de la orden
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await ordersAPI.getById(orderId);
        setOrder(response.data.data);
      } catch (err) {
        console.error('Error obteniendo orden:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Verificar pago manualmente (por si webhook falló)
  const handleVerifyPayment = async () => {
    if (!orderId) return;
    
    setVerifying(true);
    try {
      const response = await paymentAPI.verify(orderId);
      if (response.data.success) {
        // Recargar orden
        const orderResponse = await ordersAPI.getById(orderId);
        setOrder(orderResponse.data.data);
      }
    } catch (err) {
      console.error('Error verificando pago:', err);
    } finally {
      setVerifying(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-naf-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Configuración de iconos y colores según estado
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      title: '¡Pago exitoso!',
      message: 'Tu pedido ha sido confirmado. Pronto recibirás un email con los detalles.',
      showVerify: false
    },
    pending: {
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      title: 'Pago pendiente',
      message: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
      showVerify: true
    },
    failure: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      title: 'Pago no procesado',
      message: 'Hubo un problema con el pago. Puedes intentarlo nuevamente.',
      showVerify: false
    }
  };

  const config = statusConfig[status] || statusConfig.failure;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Logo */}
          <Link to="/" className="inline-block mb-6">
            <span className="text-2xl font-semibold tracking-wider">{appName}</span>
          </Link>

          {/* Icono de estado */}
          <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <Icon className={`w-10 h-10 ${config.color}`} />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-semibold mb-2">{config.title}</h1>
          
          {/* Mensaje */}
          <p className="text-gray-600 mb-6">{config.message}</p>

          {/* Info de la orden */}
          {order && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nº Pedido:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-medium">${Number(order.total).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estado:</span>
                  <span className={`font-medium ${
                    order.status === 'paid' ? 'text-green-600' : 
                    order.status === 'pending_payment' ? 'text-amber-600' : 
                    'text-gray-600'
                  }`}>
                    {order.status === 'paid' ? 'Pagado' : 
                     order.status === 'pending_payment' ? 'Pendiente' :
                     order.status === 'processing' ? 'Procesando' : order.status}
                  </span>
                </div>
                {order.mpPaymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Método:</span>
                    <span className="font-medium capitalize">{order.mpPaymentMethod.replace('_', ' ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botón verificar pago (para pending) */}
          {config.showVerify && orderId && (
            <button
              onClick={handleVerifyPayment}
              disabled={verifying}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-naf-black text-naf-black rounded-lg hover:bg-gray-50 transition-colors mb-3"
            >
              <RefreshCw className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
              {verifying ? 'Verificando...' : 'Verificar pago'}
            </button>
          )}

          {/* Botones de acción */}
          <div className="space-y-3">
            {status === 'success' && (
              <Link
                to="/orders"
                className="flex items-center justify-center gap-2 w-full py-3 bg-naf-black text-white rounded-lg hover:bg-naf-gray transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Ver mis pedidos
              </Link>
            )}
            
            {status === 'failure' && (
              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full py-3 bg-naf-black text-white rounded-lg hover:bg-naf-gray transition-colors"
              >
                Intentar de nuevo
              </Link>
            )}

            <Link
              to="/"
              className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              Volver a la tienda
            </Link>
          </div>

          {/* Nota sobre email */}
          {status === 'success' && (
            <p className="text-xs text-gray-400 mt-6">
              Te enviamos un email de confirmación a {order?.shippingEmail || 'tu correo'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
