import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collectionsAPI, productsAPI } from '../services/api'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Package, Filter } from 'lucide-react'
import ProductCard from '../components/ProductCard'

function CollectionDetail() {
  const { slug } = useParams()
  const [collection, setCollection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollection()
  }, [slug])

  const fetchCollection = async () => {
    try {
      setLoading(true)
      const response = await collectionsAPI.getBySlug(slug)
      setCollection(response.data.data)
    } catch (err) {
      console.error('Error fetching collection:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naf-black"></div>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Colección no encontrada</h2>
        <Link to="/collections" className="text-naf-black hover:underline">
          Volver a colecciones
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        {collection.image ? (
          <img 
            src={collection.image} 
            alt={collection.name}
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-naf-black" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{collection.name}</h1>
            {collection.description && (
              <p className="text-lg text-white/80 max-w-2xl mx-auto">{collection.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">
            {collection.products?.length || 0} productos
          </p>
        </div>

        {collection.products && collection.products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {collection.products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay productos en esta colección</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await collectionsAPI.getActive()
      setCollections(response.data.data || [])
    } catch (err) {
      console.error('Error fetching collections:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naf-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-naf-black py-16">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Colecciones</h1>
          <p className="text-xl text-white/70">Explora nuestras colecciones exclusivas</p>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay colecciones disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/collections/${collection.slug}`}
                  className="block group"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                    {collection.image ? (
                      <img 
                        src={collection.image} 
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{collection.name}</h3>
                      {collection.description && (
                        <p className="text-white/70 text-sm mb-3 line-clamp-2">{collection.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {collection.products?.length || 0} productos
                        </span>
                        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
