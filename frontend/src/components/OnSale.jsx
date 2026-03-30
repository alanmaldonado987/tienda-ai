import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { onSaleAPI } from '../services/api'
import { ArrowRight, Flame } from 'lucide-react'
import ProductCard from './ProductCard'

export default function OnSale({ limit = 6 }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await onSaleAPI.get(limit)
      setProducts(response.data.data || [])
    } catch (err) {
      console.error('Error fetching sale products:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || products.length === 0) return null

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-semibold">En Oferta</h2>
          </div>
          <Link 
            to="/products?filter=sale" 
            className="text-sm font-medium text-naf-black hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
