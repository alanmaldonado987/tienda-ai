import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { ordersAPI } from '../services/api';

const STATUS_LABELS = {
  pending: { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  processing: { text: 'Procesando', color: 'bg-blue-100 text-blue-800' },
  shipped: { text: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  delivered: { text: 'Entregado', color: 'bg-green-100 text-green-800' },
  cancelled: { text: 'Cancelado', color: 'bg-red-100 text-red-800' }
};

const STATUS_PAYMENT_LABELS = {
  pending: { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  paid: { text: 'Pagado', color: 'bg-green-100 text-green-800' },
  failed: { text: 'Fallido', color: 'bg-red-100 text-red-800' },
  refunded: { text: 'Reintegrado', color: 'bg-gray-100 text-gray-800' }
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.data || []);
    } catch (error) {
      showToast('Error al cargar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      return;
    }
    
    try {
      await ordersAPI.cancel(orderId, 'Cancelado por el cliente');
      showToast('Pedido cancelado', 'success');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al cancelar pedido', 'error');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mis Pedidos</h1>
          <button
            onClick={() => navigate('/profile')}
            className="text-blue-600 hover:underline"
          >
            ← Volver al perfil
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl">⏳</div>
            <p className="mt-2 text-gray-500">Cargando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold mb-2">No tienes pedidos aún</h2>
            <p className="text-gray-500 mb-6">Cuandorealices un pedido, podrás verlo aquí</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Empezar a comprar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
              const paymentInfo = STATUS_PAYMENT_LABELS[order.paymentStatus] || STATUS_PAYMENT_LABELS.pending;
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-mono font-bold text-lg">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${paymentInfo.color}`}>
                          {paymentInfo.text}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-xl">{formatPrice(order.total)}</p>
                        <p className="text-sm text-gray-500">
                          {order.items?.length || 0} productos
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded order details */}
                  {selectedOrder === order.id && (
                    <div className="border-t p-4 bg-gray-50">
                      {/* Shipping info */}
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">📦 Información de envío</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Destinatario</p>
                            <p>{order.shippingName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Teléfono</p>
                            <p>{order.shippingPhone}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500">Dirección</p>
                            <p>{order.shippingAddress}, {order.shippingCity}, {order.shippingDepartment}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment info */}
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">💳 Información de pago</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Método</p>
                            <p className="capitalize">{order.paymentMethod === 'cash' ? 'Pago contra entrega' : order.paymentMethod === 'card' ? 'Tarjeta' : 'Transferencia'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Estado</p>
                            <p>{paymentInfo.text}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Order items */}
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">🛍️ Productos</h3>
                        <div className="space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded">
                              {item.productImage && (
                                <img 
                                  src={item.productImage} 
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-gray-500">
                                  {item.selectedColor && `Color: ${item.selectedColor}`}
                                  {item.selectedSize && ` | Talla: ${item.selectedSize}`}
                                  {' | '}
                                  Cantidad: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Totals */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Subtotal</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Envío</span>
                          <span>{order.shippingCost == 0 ? 'GRATIS' : formatPrice(order.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Impuesto</span>
                          <span>{formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      
                      {/* Cancel button */}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <div className="mt-4 pt-4 border-t">
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Cancelar pedido
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
