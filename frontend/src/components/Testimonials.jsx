import { useState, useEffect, useRef } from 'react'
import { testimonialsAPI } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (testimonials.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [testimonials.length])

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsAPI.getFeatured()
      setTestimonials(response.data.data || [])
    } catch (err) {
      console.error('Error fetching testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="h-5 w-80 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) return null

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Lo que dicen nuestros clientes</h2>
          <p className="text-naf-gray">Descubre por qué aman comprar con nosotros</p>
        </div>

        <div className="relative max-w-3xl mx-auto" ref={containerRef}>
          {/* Navigation */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-naf-black" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-naf-black" />
              </button>
            </>
          )}

          {/* Testimonial */}
          <div className="overflow-hidden px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>

                {/* Comment */}
                <blockquote className="text-lg md:text-xl text-naf-black mb-6 italic">
                  "{testimonials[currentIndex].comment}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  {testimonials[currentIndex].avatar && (
                    <img 
                      src={testimonials[currentIndex].avatar} 
                      alt={testimonials[currentIndex].customerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="text-left">
                    <p className="font-semibold">{testimonials[currentIndex].customerName}</p>
                    {testimonials[currentIndex].title && (
                      <p className="text-sm text-naf-gray">{testimonials[currentIndex].title}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-naf-black w-6' : 'bg-gray-300'
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
