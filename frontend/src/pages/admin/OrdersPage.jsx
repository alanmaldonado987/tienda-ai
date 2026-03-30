import { useState, useEffect } from 'react'
import { Search, Eye, ChevronDown, X } from 'lucide-react'
import { adminOrdersAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

const statusOptions = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado']

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  procesando: 'bg-blue-100 text-blue-800',
  enviado: 'bg-purple-100 text-purple-800',
  entregado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800'
}

function OrderDetailModal({ order, onClose, onStatusChange }) {
  const [localStatus, setLocalStatus] = useState(order?.status || '')
  const [changing, setChanging] = useState(false)

  const handleStatusChange = async () => {
    setChanging(true)
    try {
      await onStatusChange(order.id, localStatus)
      onClose()
    } catch (err) {
      console.error('Error changing status:', err)
    } finally {
      setChanging(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">Pedido #{order?.orderNumber || order?.id?.slice(0, 8)}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Cliente</p>
              <p className="font-medium">{order?.shippingName || order?.user?.name || 'No disponible'}</p>
              <p className="text-sm">{order?.shippingEmail || order?.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="font-medium">{formatDate(order?.createdAt)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Dirección de envío</p>
            <p className="font-medium">
              {order?.shippingAddress}, {order?.shippingCity}, {order?.shippingDepartment}
            </p>
          </div>

          {order?.items && order.items.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Productos</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                    <span>{item.productName || item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatPrice(order?.subtotal || order?.total - (order?.shippingCost || 0) - (order?.tax || 0))}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Envío</span>
              <span>{order?.shippingCost === 0 ? 'GRATIS' : formatPrice(order?.shippingCost || 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Impuesto</span>
              <span>{formatPrice(order?.tax || 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>{formatPrice(order?.total)}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Estado</p>
            <select
              value={localStatus}
              onChange={(e) => setLocalStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              {statusOptions.map(status => (
                <option key={status} value={status} className="capitalize">{status}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button 
              onClick={handleStatusChange} 
              disabled={changing || localStatus === order.status}
              className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {changing ? 'Guardando...' : 'Actualizar estado'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await adminOrdersAPI.getAll()
      setOrders(response.data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminOrdersAPI.updateStatus(orderId, newStatus)
      await fetchOrders()
    } catch (err) {
      console.error('Error updating status:', err)
      alert(err.response?.data?.message || 'Error al actualizar estado')
    }
  }

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchLower) ||
      order.orderNumber?.toLowerCase().includes(searchLower) ||
      order.shippingName?.toLowerCase().includes(searchLower) ||
      order.shippingEmail?.toLowerCase().includes(searchLower) ||
      order.user?.name?.toLowerCase().includes(searchLower) ||
      order.user?.email?.toLowerCase().includes(searchLower)
    
    const matchesStatus = !filterStatus || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-CO')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naf-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            {statusOptions.map(status => (
              <option key={status} value={status} className="capitalize">{status}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay pedidos</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{order.shippingName || order.user?.name}</p>
                        <p className="text-xs text-gray-500">{order.shippingEmail || order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
