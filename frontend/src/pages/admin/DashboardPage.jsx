import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { dashboardAPI, adminOrdersAPI, inventoryAPI } from '../../services/api'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

function StatsCard({ title, value, icon: Icon, trend, color, subtitle, delay = 0 }) {
  const colors = {
    green: {
      bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
      light: 'bg-gray-50',
      text: 'text-gray-600',
      icon: 'bg-gray-700'
    },
    blue: {
      bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
      light: 'bg-gray-50',
      text: 'text-gray-600',
      icon: 'bg-gray-700'
    },
    orange: {
      bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
      light: 'bg-gray-50',
      text: 'text-gray-600',
      icon: 'bg-gray-700'
    },
    purple: {
      bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
      light: 'bg-gray-50',
      text: 'text-gray-600',
      icon: 'bg-gray-700'
    },
    red: {
      bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
      light: 'bg-gray-50',
      text: 'text-gray-600',
      icon: 'bg-gray-700'
    }
  }

  const c = colors[color] || colors.blue

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10">
        <Icon className="w-full h-full" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {subtitle}
              </p>
            )}
          </div>
          <div className={`${c.bg} p-3 rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {trend !== undefined && (
          <div className={`mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend >= 0 ? '+' : ''}{trend}% vs semana anterior
          </div>
        )}
      </div>
    </motion.div>
  )
}

function RecentOrders({ orders }) {
  const statusConfig = {
    pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pendiente' },
    pending_payment: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pendiente' },
    procesando: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Activity, label: 'Procesando' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Package, label: 'Enviado' },
    enviado: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Package, label: 'Enviado' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Entregado' },
    entregado: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Entregado' },
    cancelado: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Cancelado' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Cancelado' },
    paid: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Pagado' }
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
    return new Date(date).toLocaleDateString('es-CO', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Pedidos Recientes</h3>
        </div>
        <Link to="/admin/orders" className="text-sm text-naf-black hover:underline flex items-center gap-1 font-medium">
          Ver todos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {orders.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          No hay pedidos recientes
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {orders.slice(0, 5).map((order, index) => {
            const status = statusConfig[order.status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: order.status }
            const StatusIcon = status.icon
            
            return (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">#{String(order.orderNumber || order.id?.slice(0, 6)).slice(-4)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.shippingName || order.user?.name || 'Cliente'}</p>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function LowStockAlert({ products }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price || 0)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Alerta de Stock</h3>
        </div>
        <Link to="/admin/inventory" className="text-sm text-naf-black hover:underline flex items-center gap-1 font-medium">
          Gestionar <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
          Todo el inventario está bien
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {products.slice(0, 5).map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl border border-orange-100 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-gray-500">{formatPrice(product.price)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-orange-600">{product.stock}</p>
                <p className="text-xs text-gray-400">unidades</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function OrdersByStatus({ ordersByStatus }) {
  const statusConfig = {
    pendiente: { bg: 'bg-yellow-500', label: 'Pendientes' },
    pending_payment: { bg: 'bg-yellow-500', label: 'Pendiente Pago' },
    procesando: { bg: 'bg-blue-500', label: 'Procesando' },
    shipped: { bg: 'bg-purple-500', label: 'Enviados' },
    delivered: { bg: 'bg-green-500', label: 'Entregados' },
    cancelado: { bg: 'bg-red-500', label: 'Cancelados' },
    cancelled: { bg: 'bg-red-500', label: 'Cancelados' },
    paid: { bg: 'bg-green-500', label: 'Pagados' }
  }

  const statusArray = Array.isArray(ordersByStatus) ? ordersByStatus : []
  const total = statusArray.reduce((acc, item) => acc + parseInt(item.count || 0), 0) || 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-gray-500" />
        Pedidos por Estado
      </h3>
      <div className="space-y-4">
        {statusArray.map((item) => {
          const status = statusConfig[item.status] || { bg: 'bg-gray-500', label: item.status }
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
          
          return (
            <div key={item.status} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{status.label}</span>
                <span className="font-medium text-gray-900">{item.count} ({percentage}%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className={`h-full ${status.bg} rounded-full`}
                />
              </div>
            </div>
          )
        }) || (
          <p className="text-gray-500 text-sm">No hay datos</p>
        )}
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [ordersByStatus, setOrdersByStatus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const adminName = user?.name?.split(' ')[0] || 'Admin'

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const statsResponse = await dashboardAPI.getStats()
      const statsData = statsResponse.data.data
      
      const ordersResponse = await adminOrdersAPI.getAll()
      const ordersData = ordersResponse.data.data || []
      
      const lowStockResponse = await inventoryAPI.getLowStock()
      const lowStockData = lowStockResponse.data.data || []
      
      setStats(statsData.overview)
      setRecentOrders(ordersData)
      setLowStockProducts(lowStockData)
      setOrdersByStatus(statsData.ordersByStatus || [])
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-gray-200 border-t-naf-black rounded-full mx-auto mb-4"
          />
          <p className="text-gray-500">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const todayOrders = stats?.todayOrders || 0
  const weekOrders = stats?.weekOrders || 0
  const trend = weekOrders > 0 ? Math.round(((todayOrders * 7) / weekOrders - 1) * 100) : 0

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100"
        >
          {error}
        </motion.div>
      )}

      {/* Welcome Header */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-naf-black to-gray-800 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
        <div className="relative">
          <p className="text-white/70 text-sm mb-1">
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-3xl font-bold mb-2">
            Hola, <span className="text-yellow-400">{adminName}</span> 👋
          </h1>
          <p className="text-white/70">
            Aquí está lo que está pasando con tu tienda hoy
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Ventas de Hoy" 
          value={formatPrice(stats?.todayRevenue)} 
          icon={DollarSign}
          color="blue"
          subtitle={`${todayOrders} pedidos hoy`}
          trend={trend}
          delay={0}
        />
        <StatsCard 
          title="Esta Semana" 
          value={formatPrice(stats?.weekRevenue)} 
          icon={ShoppingCart}
          color="blue"
          subtitle={`${weekOrders} pedidos`}
          delay={0.1}
        />
        <StatsCard 
          title="Pendientes" 
          value={stats?.pendingOrders || 0} 
          icon={Clock}
          color="orange"
          subtitle="requieren atención"
          delay={0.2}
        />
        <StatsCard 
          title="Productos" 
          value={stats?.totalProducts || 0} 
          icon={Package}
          color="purple"
          subtitle={`${stats?.lowStockProducts || 0} stock bajo`}
          delay={0.3}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>
        <div>
          <OrdersByStatus ordersByStatus={ordersByStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlert products={lowStockProducts} />
        
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-500" />
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/admin/products/new"
              className="p-4 bg-naf-black rounded-xl text-white hover:shadow-lg transition-shadow group"
            >
              <Package className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Nuevo Producto</p>
            </Link>
            <Link 
              to="/admin/coupons/new"
              className="p-4 border-2 border-naf-black rounded-xl text-naf-black hover:bg-naf-black hover:text-white transition-colors group"
            >
              <DollarSign className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Crear Cupón</p>
            </Link>
            <Link 
              to="/admin/orders"
              className="p-4 border-2 border-naf-black rounded-xl text-naf-black hover:bg-naf-black hover:text-white transition-colors group"
            >
              <ShoppingCart className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Ver Pedidos</p>
            </Link>
            <Link 
              to="/admin/users"
              className="p-4 border-2 border-naf-black rounded-xl text-naf-black hover:bg-naf-black hover:text-white transition-colors group"
            >
              <Users className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium">Usuarios</p>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
