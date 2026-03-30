import { useState, useEffect } from 'react'
import { testimonialsAPI } from '../../services/api'
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const { user } = useAuth()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getAll()
      setTestimonials(response.data.data || [])
    } catch (err) {
      console.error('Error fetching testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id, isApproved, isFeatured) => {
    try {
      await testimonialsAPI.approve(id, isApproved, isFeatured)
      fetchTestimonials()
    } catch (err) {
      console.error('Error approving testimonial:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este testimonio?')) return
    try {
      await testimonialsAPI.delete(id)
      fetchTestimonials()
    } catch (err) {
      console.error('Error deleting testimonial:', err)
    }
  }

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'pending') return !t.isApproved
    if (filter === 'approved') return t.isApproved
    if (filter === 'featured') return t.isFeatured
    return true
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Testimonios</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'pending' ? 'bg-naf-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Pendientes ({testimonials.filter(t => !t.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'approved' ? 'bg-naf-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Aprobados ({testimonials.filter(t => t.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'featured' ? 'bg-naf-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Destacados ({testimonials.filter(t => t.isFeatured).length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTestimonials.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No hay testimonios</p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-lg border p-4 ${
                testimonial.isFeatured ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.customerName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-500">
                          {testimonial.customerName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{testimonial.customerName}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="ml-auto flex gap-2">
                      {!testimonial.isApproved && (
                        <button
                          onClick={() => handleApprove(testimonial.id, true, testimonial.isFeatured)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Aprobar"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                      {testimonial.isApproved && (
                        <button
                          onClick={() => handleApprove(testimonial.id, false, !testimonial.isFeatured)}
                          className={`p-2 rounded-lg ${
                            testimonial.isFeatured ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={testimonial.isFeatured ? 'Quitar de destacado' : 'Destacar'}
                        >
                          <Star className={`w-5 h-5 ${testimonial.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {testimonial.title && (
                    <p className="font-medium text-gray-900 mb-1">{testimonial.title}</p>
                  )}
                  <p className="text-gray-600">{testimonial.comment}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {testimonial.isApproved && (
                      <span className="text-green-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Aprobado
                      </span>
                    )}
                    {testimonial.isFeatured && (
                      <span className="text-yellow-600 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-current" /> Destacado
                      </span>
                    )}
                    <span>{new Date(testimonial.createdAt).toLocaleDateString('es-CO')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
