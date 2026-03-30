import { useState, useEffect } from 'react'
import { Search, AlertTriangle, Package, Download, Edit2, Check, X, Plus, Minus } from 'lucide-react'
import { inventoryAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

function StockAdjustModal({ product, onSave, onClose }) {
  const [adjustment, setAdjustment] = useState(0)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(parseInt(adjustment), reason)
    } finally {
      setLoading(false)
    }
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
        className="bg-white rounded-xl w-full max-w-md"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ajustar Stock</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Producto</p>
            <p className="font-medium">{product?.name}</p>
            <p className="text-sm text-gray-500 mt-2">Stock actual: <span className="font-bold">{product?.stock}</span></p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ajuste de stock</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdjustment(adjustment - 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center"
              />
              <button
                type="button"
                onClick={() => setAdjustment(adjustment + 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Nuevo stock: <span className="font-bold text-green-600">{product?.stock + adjustment}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Razón (opcional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              placeholder="ej: Reabastecimiento, Venta, Daño, etc."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || adjustment === 0}
              className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Check className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Aplicar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function InventoryPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStock, setFilterStock] = useState('all') // all, low, out
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await inventoryAPI.getAll()
      setProducts(response.data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching inventory:', err)
      setError('Error al cargar inventario')
    } finally {
      setLoading(false)
    }
  }

  const handleAdjustStock = async (adjustment, reason) => {
    try {
      await inventoryAPI.adjust(editingProduct.id, adjustment, reason)
      await fetchInventory()
      setEditingProduct(null)
    } catch (err) {
      console.error('Error adjusting stock:', err)
      alert(err.response?.data?.message || 'Error al ajustar stock')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || true
    let matchesStock = true
    if (filterStock === 'low') matchesStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5)
    if (filterStock === 'out') matchesStock = product.stock === 0
    return matchesSearch && matchesStock
  })

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5)).length
  const outOfStockCount = products.filter(p => p.stock === 0).length
  const totalProducts = products.length

  const getStockStatus = (product) => {
    if (product.stock === 0) return { label: 'Sin stock', class: 'bg-red-100 text-red-800' }
    if (product.stock <= (product.lowStockThreshold || 5)) return { label: 'Stock bajo', class: 'bg-orange-100 text-orange-800' }
    return { label: 'En stock', class: 'bg-green-100 text-green-800' }
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
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Sin Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
          >
            <option value="all">Todo el stock</option>
            <option value="low">Stock bajo</option>
            <option value="out">Sin stock</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay productos en el inventario</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Umbral</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product)
                  return (
                    <motion.tr 
                      key={product.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ${product.price?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-lg">{product.stock}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {product.lowStockThreshold || 5}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Ajustar stock"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Stock Adjust Modal */}
      <AnimatePresence>
        {editingProduct && (
          <StockAdjustModal
            product={editingProduct}
            onSave={handleAdjustStock}
            onClose={() => setEditingProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
