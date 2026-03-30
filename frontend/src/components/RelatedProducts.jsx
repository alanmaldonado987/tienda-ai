import { useState, useEffect } from 'react'
import { productsAPI } from '../services/api'
import ProductCard from './ProductCard'
import { motion } from 'framer-motion'

export default function RelatedProducts({ currentProductId, category, limit = 4 }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (category) {
      fetchRelatedProducts()
    }
  }, [category, currentProductId])

  const fetchRelatedProducts = async () => {
    try {
      const response = await productsAPI.getAll({ category, limit: limit + 5 })
      const filtered = (response.data.data || [])
        .filter(p => p.id !== currentProductId)
        .slice(0, limit)
      setProducts(filtered)
    } catch (err) {
      console.error('Error fetching related products:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || products.length === 0) return null

  return (
    <section className="py-8 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold mb-6">También te puede gustar</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
