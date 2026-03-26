import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Star, Truck, RefreshCw, Shield, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsAPI } from '../services/api';
import SizeGuide from './SizeGuide';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const { addToCart, triggerFlyingProduct } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getById(id);
        setProduct(response.data.data);
        // Set default selections
        if (response.data.data.colors?.length) {
          setSelectedColor(response.data.data.colors[0]);
        }
        if (response.data.data.sizes?.length) {
          setSelectedSize(response.data.data.sizes[0]);
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
    triggerFlyingProduct({
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      image: product.image,
      name: product.name
    });
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-gray-500">Cargando...</div>
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
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-naf-black transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a la tienda
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Imagenes */}
        <div className="space-y-4">
          {/* Imagen principal */}
          <div className="aspect-[3/4] bg-naf-light-gray overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info del producto */}
        <div className="space-y-6">
          {/* Titulo y precio */}
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

          {/* Colores */}
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

          {/* Tallas */}
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

          {/* Cantidad */}
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

          {/* Botones */}
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

          {/* Beneficios */}
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

          {/* Descripción */}
          {product.description && (
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium mb-2">Descripción</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
}
