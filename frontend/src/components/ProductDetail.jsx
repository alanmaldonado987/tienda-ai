import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Star, Truck, RefreshCw, Shield, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsAPI, recentlyViewedAPI } from '../services/api';
import SizeGuide from './SizeGuide';
import { ProductDetailSkeleton } from './Skeleton';
import RelatedProducts from './RelatedProducts';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const { addToCart, triggerFlyingProduct } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const generateSessionId = () => {
      const id = 'session_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('sessionId', id)
      return id
    }

    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getById(id);
        const productData = response.data.data;
        
        // Normalizar imágenes: asegurar que sea array con al menos una imagen
        if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
          // Ya tiene imágenes, verificar que no tenga undefined
          productData.images = productData.images.filter(img => img);
        }
        
        // Si no hay images o está vacío, usar image (legacy) o placeholder
        if (!productData.images || productData.images.length === 0) {
          if (productData.image) {
            productData.images = [productData.image];
          } else {
            productData.images = ['https://via.placeholder.com/800x1000?text=No+Image'];
          }
        }
        
        setProduct(productData);
        
        // Set default selections
        if (productData.colors?.length) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.sizes?.length) {
          setSelectedSize(productData.sizes[0]);
        }

        // Registrar en recently viewed
        try {
          const sessionId = localStorage.getItem('sessionId') || generateSessionId()
          await recentlyViewedAPI.add(id, sessionId)
        } catch (err) {
          console.error('Error adding to recently viewed:', err)
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e) => {
    if (!selectedSize) {
      alert('Por favor selecciona una talla');
      return;
    }
    // Animación de vuelo al carrito
    const rect = e.currentTarget.getBoundingClientRect();
    // Obtener posición del botón del carrito
    const cartButton = document.querySelector('[data-cart-button]');
    const targetPosition = cartButton 
      ? { 
          x: cartButton.getBoundingClientRect().left + cartButton.getBoundingClientRect().width / 2,
          y: cartButton.getBoundingClientRect().top + cartButton.getBoundingClientRect().height / 2
        }
      : null;
    
    triggerFlyingProduct({
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      image: product.images[selectedImageIndex],
      name: product.name
    }, targetPosition);
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Producto no encontrado</p>
        <Link to="/" className="text-naf-black underline">Volver a la tienda</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-naf-black transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div 
            className="relative aspect-[3/4] bg-naf-light-gray overflow-hidden cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={product.images[selectedImageIndex]}
              alt={`${product.name} - Imagen ${selectedImageIndex + 1}`}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                    }
                  : {}
              }
            />
            {product.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 text-xs flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {selectedImageIndex + 1}/{product.images.length}
              </div>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-naf-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            {product.tag && (
              <span className="inline-block bg-naf-black text-white text-xs px-3 py-1 tracking-wider mb-3">
                {product.tag}
              </span>
            )}
            <h1 className="text-2xl lg:text-3xl font-semibold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Color: <span className="font-normal text-gray-600">{selectedColor}</span></p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-naf-black scale-110' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Talla:</p>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-gray-500 flex items-center gap-1 hover:text-naf-black transition-colors"
                >
                  <Ruler className="w-4 h-4" />
                  Guía de tallas
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] px-4 py-2 text-sm border transition-all ${
                      selectedSize === size
                        ? 'border-naf-black bg-naf-black text-white'
                        : 'border-gray-200 hover:border-naf-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2">Cantidad:</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-naf-black transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:border-naf-black transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-naf-black text-white py-3 text-sm font-medium tracking-wider hover:bg-naf-gray transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              AGREGAR AL CARRITO
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`w-14 h-14 border flex items-center justify-center transition-colors ${
                inWishlist ? 'border-red-500 text-red-500' : 'border-gray-200 hover:border-naf-black'
              }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-5 h-5" />
              <span>Envío gratis en pedidos mayores a $150.000</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RefreshCw className="w-5 h-5" />
              <span>5 días para cambios y devoluciones</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="w-5 h-5" />
              <span>Garantía de fabricación</span>
            </div>
          </div>

          {product.description && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium mb-2">Descripción</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
      
      <RelatedProducts 
        currentProductId={product?.id} 
        category={product?.category} 
      />
    </div>
  );
}
