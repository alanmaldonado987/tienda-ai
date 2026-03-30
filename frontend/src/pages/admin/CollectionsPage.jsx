import { useState, useEffect, useRef } from 'react'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  X,
  Check,
  Image,
  Package,
  Star,
  GripVertical,
  ArrowRight
} from 'lucide-react'
import { collectionsAPI, productsAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

// Collection Modal
function CollectionModal({ collection, products, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: collection?.name || '',
    description: collection?.description || '',
    image: collection?.image || '',
    isActive: collection?.isActive ?? true,
    isFeature: collection?.isFeature ?? false,
    sortOrder: collection?.sortOrder || 0
  })
  const [selectedProducts, setSelectedProducts] = useState([])
  const [searchProduct, setSearchProduct] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (collection?.products) {
      setSelectedProducts(collection.products.map(p => p.id))
    }
  }, [collection])

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({...formData, image: e.target.result})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        ...formData,
        productIds: selectedProducts
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
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
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">
            {collection ? 'Editar Colección' : 'Nueva Colección'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side - Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Activa</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeature}
                    onChange={(e) => setFormData({...formData, isFeature: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Destacada (Home)</span>
                </label>
              </div>
            </div>

            {/* Right side - Image & Products */}
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de Portada</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() => inputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    dragActive ? 'border-naf-black bg-gray-50' : 'border-gray-300 hover:border-naf-black'
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                  />
                  {formData.image ? (
                    <div className="relative">
                      <img src={formData.image} alt="Preview" className="h-32 mx-auto rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFormData({...formData, image: ''}) }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click o arrastra una imagen</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Products Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Productos ({selectedProducts.length} seleccionados)
                </label>
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  <div className="p-2 border-b bg-gray-50">
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div className="divide-y max-h-32 overflow-y-auto">
                    {filteredProducts.map(product => (
                      <label
                        key={product.id}
                        className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 ${
                          selectedProducts.includes(product.id) ? 'bg-gray-50' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProduct(product.id)}
                          className="rounded"
                        />
                        <img
                          src={product.image || 'https://via.placeholder.com/40'}
                          alt={product.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="text-sm truncate flex-1">{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
              Guardar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [collectionsRes, productsRes] = await Promise.all([
        collectionsAPI.getAll(),
        productsAPI.getAll()
      ])
      setCollections(collectionsRes.data.data || [])
      setProducts(productsRes.data.data || [])
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
      if (editingCollection) {
        await collectionsAPI.update(editingCollection.id, formData)
      } else {
        await collectionsAPI.create(formData)
      }
      await fetchData()
      setShowModal(false)
      setEditingCollection(null)
    } catch (err) {
      console.error('Error saving collection:', err)
      alert(err.response?.data?.message || 'Error al guardar colección')
    }
  }

  const handleDelete = async (id) => {
    try {
      await collectionsAPI.delete(id)
      await fetchData()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting collection:', err)
      alert(err.response?.data?.message || 'Error al eliminar colección')
    }
  }

  const filteredCollections = collections.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naf-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Colecciones</h2>
          <p className="text-gray-500">Gestiona las colecciones de productos</p>
        </div>
        <button
          onClick={() => { setEditingCollection(null); setShowModal(true) }}
          className="px-4 py-2.5 bg-naf-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Colección
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar colecciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent bg-gray-50"
          />
        </div>
      </div>

      {/* Collections Grid */}
      {filteredCollections.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No hay colecciones</p>
          <button
            onClick={() => { setEditingCollection(null); setShowModal(true) }}
            className="mt-4 text-naf-black font-medium hover:underline"
          >
            Crear primera colección
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="h-40 bg-gray-100 relative">
                {collection.image ? (
                  <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                {collection.isFeature && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> DESTACADA
                  </div>
                )}
                {!collection.isActive && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded-full">
                    INACTIVA
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                  <span className="text-xs text-gray-500">{collection.productCount || 0} productos</span>
                </div>
                {collection.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{collection.description}</p>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t">
                  <button
                    onClick={() => { setEditingCollection(collection); setShowModal(true) }}
                    className="text-sm text-naf-black hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(collection)}
                    className="text-sm text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <CollectionModal
            collection={editingCollection}
            products={products}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditingCollection(null) }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md"
          >
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar "{deleteConfirm.name}"? Esta acción no se puede deshacer.
            </p>
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
