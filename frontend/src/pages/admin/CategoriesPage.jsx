import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, Check, Image } from 'lucide-react'
import { categoriesAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

function CategoryModal({ category, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
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
        className="bg-white rounded-xl w-full max-w-lg"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{category ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
              {loading ? <Check className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {category ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function DeleteConfirmModal({ categoryName, onConfirm, onCancel }) {
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
        className="bg-white rounded-xl p-6 max-w-md"
      >
        <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
        <p className="text-gray-600 mb-6">¿Estás seguro de que quieres eliminar la categoría "{categoryName}"?</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Eliminar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoriesAPI.getAll()
      setCategories(response.data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData) => {
    try {
      setSaving(true)
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData)
      } else {
        await categoriesAPI.create(formData)
      }
      await fetchCategories()
      setShowModal(false)
      setEditingCategory(null)
    } catch (err) {
      console.error('Error saving category:', err)
      alert(err.response?.data?.message || 'Error al guardar categoría')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await categoriesAPI.delete(id)
      await fetchCategories()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting category:', err)
      alert(err.response?.data?.message || 'Error al eliminar categoría')
    }
  }

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
          />
        </div>
        <button
          onClick={() => { setEditingCategory(null); setShowModal(true) }}
          className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay categorías</p>
          <button
            onClick={() => { setEditingCategory(null); setShowModal(true) }}
            className="mt-4 text-naf-black underline"
          >
            Crear primera categoría
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-300">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description || 'Sin descripción'}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { setEditingCategory(category); setShowModal(true) }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category)}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
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
          <CategoryModal
            category={editingCategory}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditingCategory(null) }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <DeleteConfirmModal
            categoryName={deleteConfirm.name}
            onConfirm={() => handleDelete(deleteConfirm.id)}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
