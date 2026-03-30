import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, Check, Copy } from 'lucide-react'
import { couponsAPI } from '../../services/api'
import { motion, AnimatePresence } from 'framer-motion'

function CouponModal({ coupon, onSave, onClose }) {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    discountType: coupon?.discountType || 'percentage',
    discountValue: coupon?.discountValue || '',
    minPurchase: coupon?.minPurchase || 0,
    maxUses: coupon?.maxUses || '',
    perUserLimit: coupon?.perUserLimit || 1,
    startsAt: coupon?.startsAt ? coupon.startsAt.split('T')[0] : '',
    expiresAt: coupon?.expiresAt ? coupon.expiresAt.split('T')[0] : '',
    isActive: coupon?.isActive ?? true,
    description: coupon?.description || ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        ...formData,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        discountValue: parseInt(formData.discountValue),
        minPurchase: parseInt(formData.minPurchase) || 0,
        perUserLimit: parseInt(formData.perUserLimit) || 1
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
        className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">{coupon ? 'Editar Cupón' : 'Nuevo Cupón'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              placeholder="ej: VERANO20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              placeholder="ej: Descuento de verano"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                placeholder={formData.discountType === 'percentage' ? '20' : '10000'}
                required
                min={formData.discountType === 'percentage' ? 1 : 0}
                max={formData.discountType === 'percentage' ? 100 : undefined}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto mínimo de compra ($)</label>
            <input
              type="number"
              value={formData.minPurchase}
              onChange={(e) => setFormData({...formData, minPurchase: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input
                type="date"
                value={formData.startsAt}
                onChange={(e) => setFormData({...formData, startsAt: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usos máximos</label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                placeholder="Ilimitado"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usos por usuario</label>
              <input
                type="number"
                value={formData.perUserLimit}
                onChange={(e) => setFormData({...formData, perUserLimit: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                min={1}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Cupón activo</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
              {loading ? <Check className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {coupon ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const response = await couponsAPI.getAll()
      setCoupons(response.data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching coupons:', err)
      setError('Error al cargar cupones')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData) => {
    try {
      if (editingCoupon) {
        await couponsAPI.update(editingCoupon.id, formData)
      } else {
        await couponsAPI.create(formData)
      }
      await fetchCoupons()
      setShowModal(false)
      setEditingCoupon(null)
    } catch (err) {
      console.error('Error saving coupon:', err)
      alert(err.response?.data?.message || 'Error al guardar cupón')
    }
  }

  const handleDelete = async (id) => {
    try {
      await couponsAPI.delete(id)
      await fetchCoupons()
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Error deleting coupon:', err)
      alert(err.response?.data?.message || 'Error al eliminar cupón')
    }
  }

  const toggleActive = async (coupon) => {
    try {
      await couponsAPI.update(coupon.id, { isActive: !coupon.isActive })
      await fetchCoupons()
    } catch (err) {
      console.error('Error toggling coupon:', err)
      alert(err.response?.data?.message || 'Error al cambiar estado')
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
  }

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('es-CO')
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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cupones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
          />
        </div>
        <button
          onClick={() => { setEditingCoupon(null); setShowModal(true) }}
          className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cupón
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay cupones</p>
          <button
            onClick={() => { setEditingCoupon(null); setShowModal(true) }}
            className="mt-4 text-naf-black underline"
          >
            Crear primer cupón
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => (
            <motion.div 
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl shadow-sm border p-6 ${!coupon.isActive ? 'border-gray-200 opacity-60' : 'border-gray-100'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-lg font-bold text-naf-black bg-gray-100 px-3 py-1 rounded">{coupon.code}</code>
                    <button onClick={() => copyCode(coupon.code)} className="p-1 hover:bg-gray-100 rounded">
                      <Copy className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue.toLocaleString()}`}
                    <span className="text-sm font-normal text-gray-500"> descuento</span>
                  </p>
                </div>
                <button
                  onClick={() => toggleActive(coupon)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {coupon.isActive ? 'Activo' : 'Inactivo'}
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Válido desde</span>
                  <span className="text-gray-900">{formatDate(coupon.startsAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Válido hasta</span>
                  <span className="text-gray-900">{formatDate(coupon.expiresAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Usos</span>
                  <span className="text-gray-900">{coupon.usedCount || 0} / {coupon.maxUses || '∞'}</span>
                </div>
                {coupon.minPurchase > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mín. compra</span>
                    <span className="text-gray-900">${coupon.minPurchase.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => { setEditingCoupon(coupon); setShowModal(true) }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => setDeleteConfirm(coupon)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <CouponModal
            coupon={editingCoupon}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditingCoupon(null) }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md"
          >
            <h3 className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que quieres eliminar el cupón "{deleteConfirm.code}"?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
