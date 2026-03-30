import { useState, useEffect } from 'react'
import { Search, Check, X, MessageSquare, Star, Filter } from 'lucide-react'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    // Simulated data
    setReviews([
      { id: '1', productName: 'Camisa Manga Larga Classic', userName: 'Juan Pérez', rating: 5, comment: 'Excelente calidad, muy recomendadas', approved: true, createdAt: '2024-03-25', reply: null },
      { id: '2', productName: 'Jeans Slim Fit', userName: 'María García', rating: 4, comment: 'Buen producto, el tallaje algo pequeño', approved: true, createdAt: '2024-03-24', reply: 'Gracias por tu feedback, próxima vez podemos hacer cambio' },
      { id: '3', productName: 'Sudadera con Capucha', userName: 'Carlos López', rating: 2, comment: 'La tela es muy delgada, no recomiendo', approved: false, createdAt: '2024-03-27', reply: null },
      { id: '4', productName: 'Vestido Midi Floral', userName: 'Ana Martínez', rating: 5, comment: 'Me encantó, exactamente como en la foto', approved: true, createdAt: '2024-03-23', reply: null },
      { id: '5', productName: 'Zapatillas Urbanas', userName: 'Pedro Sánchez', rating: 3, comment: 'Regular, esperaba mejor calidad', approved: false, createdAt: '2024-03-26', reply: null },
    ])
    setLoading(false)
  }, [])

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    let matchesStatus = true
    if (filterStatus === 'approved') matchesStatus = review.approved
    if (filterStatus === 'pending') matchesStatus = !review.approved
    return matchesSearch && matchesStatus
  })

  const approveReview = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: true } : r))
  }

  const rejectReview = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, approved: false } : r))
  }

  const deleteReview = (id) => {
    setReviews(reviews.filter(r => r.id !== id))
  }

  const submitReply = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, reply: replyText } : r))
    setReplyingTo(null)
    setReplyText('')
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Total Reseñas</p>
          <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Aprobadas</p>
          <p className="text-2xl font-bold text-green-600">{reviews.filter(r => r.approved).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-orange-600">{reviews.filter(r => !r.approved).length}</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar reseñas..."
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
            <option value="all">Todas</option>
            <option value="approved">Aprobadas</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-medium text-gray-900">{review.productName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">Por {review.userName}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{review.createdAt}</span>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>

            <p className="text-gray-700 mb-4">{review.comment}</p>

            {review.reply && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Respuesta:
                </p>
                <p className="text-sm text-gray-600 mt-1">{review.reply}</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t">
              {!review.approved && (
                <>
                  <button
                    onClick={() => approveReview(review.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => rejectReview(review.id)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Rechazar
                  </button>
                </>
              )}
              {review.approved && !review.reply && (
                <button
                  onClick={() => setReplyingTo(review.id)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Responder
                </button>
              )}
              <button
                onClick={() => deleteReview(review.id)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                Eliminar
              </button>
            </div>

            {/* Reply Form */}
            {replyingTo === review.id && (
              <div className="mt-4 pt-4 border-t">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naf-black focus:border-transparent"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => submitReply(review.id)}
                    className="px-4 py-2 bg-naf-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Enviar Respuesta
                  </button>
                  <button
                    onClick={() => { setReplyingTo(null); setReplyText('') }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
