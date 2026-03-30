import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  X,
  Check
} from 'lucide-react'
import { productsAPI, categoriesAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

// Product Modal Form
function ProductModal({ product, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    category: product?.category || '',
    gender: product?.gender || '',
    tag: product?.tag || '',
    description: product?.description || '',
    stock: product?.stock || 0,
    image: product?.image || '',
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    isActive: product?.isActive ?? true
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        ...formData,
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
        stock: parseInt(formData.stock) || 0
      })
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
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio Original (promoción)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                placeholder="Precio sin descuento"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData({...formData, tag: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              >
                <option value="">Sin tag</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Oferta">Oferta</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Descuento">Descuento</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activo</label>
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-5 h-5"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Producto visible en la tienda
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Check className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ])
      setProducts(productsRes.data.data || [])
      setCategories(categoriesRes.data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData)
      } else {
        await productsAPI.create(formData)
      }
      await fetchData()
      setShowModal(false)
      setEditingProduct(null)
    } catch (err) {
      console.error('Error saving product:', err)
      alert(err.response?.data?.message || 'Error al guardar producto')
    }
  }

  const handleDelete = async (id) => {
    try {
      await productsAPI.delete(id)
      await fetchData()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting product:', err)
      alert(err.response?.data?.message || 'Error al eliminar producto')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const tagColors = {
    'Nuevo': 'bg-blue-100 text-blue-800',
    'Oferta': 'bg-red-100 text-red-800',
    'Best Seller': 'bg-green-100 text-green-800',
    'Descuento': 'bg-purple-100 text-purple-800'
  }

  // Get unique categories from products + categories
  const allCategories = [...new Set([
    ...categories.map(c => c.name),
    ...products.map(p => p.category).filter(Boolean)
  ])]

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
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowModal(true) }}
          className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay productos</p>
          <button
            onClick={() => { setEditingProduct(null); setShowModal(true) }}
            className="mt-4 text-naf-black underline"
          >
            Crear primer producto
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.images?.[0] || product.image || 'https://via.placeholder.com/48'} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded" 
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{product.category || '-'}</td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-gray-900">${product.price?.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-400 line-through">${product.originalPrice?.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : product.stock < 30 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.tag && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[product.tag]}`}>
                          {product.tag}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingProduct(product); setShowModal(true) }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ProductModal
            product={editingProduct}
            categories={allCategories}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditingProduct(null) }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md"
          >
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que quieres eliminar "{deleteConfirm.name}"? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
