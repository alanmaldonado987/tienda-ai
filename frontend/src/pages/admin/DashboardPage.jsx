import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { dashboardAPI, adminOrdersAPI, inventoryAPI } from '../../services/api'
import { motion } from 'framer-motion'

// Stats Card Component
function StatsCard({ title, value, icon: Icon, trend, color, subtitle }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {trend >= 0 ? '+' : ''}{trend}%
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].replace('bg-', 'text-')}`} />
        </div>
      </div>
    </motion.div>
  )
}

// Recent Orders Table
function RecentOrders({ orders }) {
  const statusColors = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    procesando: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
    pending_payment: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Pedidos Recientes</h3>
        <Link to="/admin/orders" className="text-sm text-naf-black hover:underline flex items-center gap-1">
          Ver todos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {orders.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No hay pedidos recientes
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    #{order.orderNumber || order.id?.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.shippingName || order.user?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Low Stock Alert
function LowStockAlert({ products }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">Stock Bajo</h3>
        </div>
        <Link to="/admin/inventory" className="text-sm text-naf-black hover:underline flex items-center gap-1">
          Gestionar <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No hay productos con stock bajo
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-orange-600">{product.stock} unidades</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsResponse = await dashboardAPI.getStats()
      const statsData = statsResponse.data.data
      
      // Fetch recent orders
      const ordersResponse = await adminOrdersAPI.getAll()
      const ordersData = ordersResponse.data.data || []
      
      // Fetch low stock products
      const lowStockResponse = await inventoryAPI.getLowStock()
      const lowStockData = lowStockResponse.data.data || []
      
      setStats(statsData.overview)
      setRecentOrders(ordersData)
      setLowStockProducts(lowStockData)
      setError(null)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Error al cargar datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price || 0)
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
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Ventas Hoy" 
          value={formatPrice(stats?.todayRevenue)} 
          icon={DollarSign}
          color="green"
          subtitle={`${stats?.todayOrders || 0} pedidos`}
        />
        <StatsCard 
          title="Ventas 7 días" 
          value={formatPrice(stats?.weekRevenue)} 
          icon={ShoppingCart}
          color="blue"
          subtitle={`${stats?.weekOrders || 0} pedidos`}
        />
        <StatsCard 
          title="Pedidos Pendientes" 
          value={stats?.pendingOrders || 0} 
          icon={AlertTriangle}
          color="orange"
        />
        <StatsCard 
          title="Productos" 
          value={stats?.totalProducts || 0} 
          icon={Package}
          color="purple"
          subtitle={`${stats?.lowStockProducts || 0} con stock bajo`}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrders} />
        <LowStockAlert products={lowStockProducts} />
      </div>
    </div>
  )
}
