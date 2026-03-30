import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { collectionsAPI } from '../services/api'
import { ChevronRight, ArrowRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CollectionsCarousel() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await collectionsAPI.getFeatured()
      setCollections(response.data.data || [])
    } catch (err) {
      console.error('Error fetching collections:', err)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % collections.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (loading || collections.length === 0) return null

  return (
    <section className="py-8 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Colecciones Destacadas</h2>
          <Link 
            to="/collections" 
            className="text-sm font-medium text-naf-black hover:underline flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {collections.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-naf-black" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-naf-black" />
              </button>
            </>
          )}

          {/* Slides */}
          <div 
            ref={carouselRef}
            className="overflow-hidden rounded-2xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative"
              >
                <Link to={`/collections/${collections[currentIndex].slug}`}>
                  <div className="aspect-[21/9] relative">
                    {collections[currentIndex].image ? (
                      <img 
                        src={collections[currentIndex].image} 
                        alt={collections[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-400">Sin imagen</p>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold mb-3"
                      >
                        {collections[currentIndex].name}
                      </motion.h3>
                      {collections[currentIndex].description && (
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-white/80 text-lg mb-4 max-w-xl"
                        >
                          {collections[currentIndex].description}
                        </motion.p>
                      )}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-2 text-base font-medium"
                      >
                        <span>{collections[currentIndex].products?.length || 0} productos</span>
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          {collections.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {collections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-naf-black w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
