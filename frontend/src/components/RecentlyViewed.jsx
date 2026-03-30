import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { recentlyViewedAPI } from '../services/api'
import { Clock, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RecentlyViewed() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId') || generateSessionId()
      const response = await recentlyViewedAPI.get(sessionId)
      setProducts(response.data.data || [])
    } catch (err) {
      console.error('Error fetching recently viewed:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateSessionId = () => {
    const id = 'session_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('sessionId', id)
    return id
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading || products.length === 0) return null

  const visibleProducts = products.slice(0, 4)

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-naf-black text-white rounded-full shadow-xl flex items-center justify-center hover:bg-naf-gray transition-colors"
      >
        <Clock className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Vistos Recientemente
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {products.map((item) => {
                  const product = item.product
                  if (!product) return null
                  
                  const images = Array.isArray(product.images) 
                    ? product.images 
                    : product.image ? [product.image] 
                    : ['https://via.placeholder.com/400x533?text=No+Image']

                  return (
                    <Link
                      key={item.id}
                      to={`/product/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <img
                        src={images[0]}
                        alt={product.name}
                        className="w-20 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(product.discountPrice || product.price)}
                        </p>
                        {product.originalPrice && !product.discountPrice && (
                          <p className="text-xs text-naf-gray line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>

              {products.length > 4 && (
                <div className="p-4 border-t">
                  <Link
                    to="/recently-viewed"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1 text-sm font-medium text-naf-black hover:underline"
                  >
                    Ver todos los {products.length} productos
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
