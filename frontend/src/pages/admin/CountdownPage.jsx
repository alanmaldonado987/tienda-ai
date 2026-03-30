import { useState, useEffect } from 'react'
import { countdownAPI } from '../../services/api'
import { Clock, Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

export default function CountdownPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercent: 20,
    discountCode: '',
    image: '',
    startDate: '',
    endDate: '',
    isActive: true,
    isFeatured: false,
    category: ''
  })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await countdownAPI.getAll()
      setOffers(response.data.data || [])
    } catch (err) {
      console.error('Error fetching offers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingOffer) {
        await countdownAPI.update(editingOffer.id, formData)
      } else {
        await countdownAPI.create(formData)
      }
      setShowForm(false)
      setEditingOffer(null)
      resetForm()
      fetchOffers()
    } catch (err) {
      console.error('Error saving offer:', err)
    }
  }

  const handleEdit = (offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description || '',
      discountPercent: offer.discountPercent,
      discountCode: offer.discountCode || '',
      image: offer.image || '',
      startDate: offer.startDate?.slice(0, 16) || '',
      endDate: offer.endDate?.slice(0, 16) || '',
      isActive: offer.isActive,
      isFeatured: offer.isFeatured,
      category: offer.category || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta oferta?')) return
    try {
      await countdownAPI.delete(id)
      fetchOffers()
    } catch (err) {
      console.error('Error deleting offer:', err)
    }
  }

  const handleToggle = async (offer) => {
    try {
      await countdownAPI.update(offer.id, { isActive: !offer.isActive })
      fetchOffers()
    } catch (err) {
      console.error('Error toggling offer:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discountPercent: 20,
      discountCode: '',
      image: '',
      startDate: '',
      endDate: '',
      isActive: true,
      isFeatured: false,
      category: ''
    })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatus = (offer) => {
    const now = new Date()
    const start = new Date(offer.startDate)
    const end = new Date(offer.endDate)
    
    if (!offer.isActive) return { label: 'Inactiva', color: 'bg-gray-100 text-gray-600' }
    if (now < start) return { label: 'Programada', color: 'bg-blue-100 text-blue-600' }
    if (now > end) return { label: 'Expirada', color: 'bg-red-100 text-red-600' }
    return { label: 'Activa', color: 'bg-green-100 text-green-600' }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="w-7 h-7" />
          Ofertas Countdown
        </h1>
        <button
          onClick={() => { resetForm(); setEditingOffer(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-naf-black text-white px-4 py-2 rounded-lg hover:bg-naf-gray transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Oferta
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingOffer ? 'Editar Oferta' : 'Nueva Oferta'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                placeholder="Ej: ¡Última Chance!"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">% Descuento</label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código (opcional)</label>
              <input
                type="text"
                value={formData.discountCode}
                onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                placeholder="Ej: VERANO20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="datetime-local"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría (opcional)</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                placeholder="Ej: hombre, mujer, sale"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-naf-black focus:ring-naf-black"
                />
                <span className="text-sm font-medium text-gray-700">Activa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-naf-black focus:ring-naf-black"
                />
                <span className="text-sm font-medium text-gray-700">Mostrar en home</span>
              </label>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-naf-black text-white px-6 py-2 rounded-lg hover:bg-naf-gray transition-colors"
              >
                {editingOffer ? 'Guardar Cambios' : 'Crear Oferta'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingOffer(null); resetForm() }}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay ofertas countdown</p>
          </div>
        ) : (
          offers.map((offer) => {
            const status = getStatus(offer)
            return (
              <div
                key={offer.id}
                className={`bg-white rounded-lg border p-4 ${
                  offer.isFeatured ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{offer.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      {offer.isFeatured && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          ★ Destacada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="font-bold text-red-600">{offer.discountPercent}% OFF</span>
                      {offer.discountCode && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded">Código: {offer.discountCode}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Inicio: {formatDate(offer.startDate)}</span>
                      <span>Fin: {formatDate(offer.endDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(offer)}
                      className={`p-2 rounded-lg ${
                        offer.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={offer.isActive ? 'Desactivar' : 'Activar'}
                    >
                      {offer.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={() => handleEdit(offer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
