import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '#000000');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Único');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { addToCart, triggerFlyingProduct } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Normalizar imagen: si es string, convertir a array; si no hay, usar placeholder
  const productImages = Array.isArray(product.images) 
    ? product.images 
    : product.image 
      ? [product.image] 
      : ['https://via.placeholder.com/400x533?text=No+Image'];

  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Obtener posición del click para la animación
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
      image: productImages[0],
      name: product.name
    }, targetPosition);
    addToCart(product, selectedSize, selectedColor);
    setShowQuickAdd(false);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col h-full pb-12">
      {/* Image container */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="relative aspect-[3/4] overflow-hidden bg-naf-light-gray mb-3">
          <img
            src={productImages[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-naf-black text-white text-xs px-3 py-1 tracking-wider">
                NUEVO
              </span>
            )}
            {product.tag && (
              <span className="bg-naf-black text-white text-xs px-3 py-1 tracking-wider">
                {product.tag}
              </span>
            )}
            {product.showDiscount && product.discountPrice && (
              <span className="bg-red-600 text-white text-xs px-3 py-1 tracking-wider font-bold">
                {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
              </span>
            )}
            {product.originalPrice && !product.showDiscount && (
              <span className="bg-red-600 text-white text-xs px-3 py-1 tracking-wider font-bold">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Wishlist button - siempre visible */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center transition-all duration-300 hover:text-red-500 ${
              inWishlist ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Heart
              className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`}
            />
          </button>
        </div>
      </Link>

      {/* Quick add button */}
      <button
        onClick={() => setShowQuickAdd(!showQuickAdd)}
        className="absolute bottom-0 left-0 right-0 bg-naf-black text-white py-2 text-sm tracking-wider hover:bg-naf-gray transition-colors flex items-center justify-center gap-1"
      >
        {showQuickAdd ? (
          <>CERRAR</>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            AGREGAR
          </>
        )}
      </button>

      {/* Quick add panel */}
      {showQuickAdd && (
        <div className="absolute bottom-12 left-0 right-0 bg-white shadow-xl border border-gray-100 p-4 z-20 animate-fade-in">
          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-naf-gray mb-2">Color</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColor === color ? 'border-naf-black scale-110' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-naf-gray mb-2">Talla</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 text-xs border ${
                      selectedSize === size
                        ? 'border-naf-black bg-naf-black text-white'
                        : 'border-gray-200 hover:border-naf-black'
                    } transition-colors`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-naf-black text-white py-2.5 text-sm tracking-wider flex items-center justify-center gap-2 hover:bg-naf-gray transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            AGREGAR AL CARRITO
          </button>
        </div>
      )}

      {/* Product info */}
      <Link to={`/product/${product.id}`} className="mt-auto">
        <div className="space-y-1">
          <h3 className="text-sm font-medium group-hover:text-naf-gray transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && product.originalPrice && (
              <span className="text-sm text-naf-gray line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {!product.discountPrice && product.originalPrice && (
              <span className="text-sm text-naf-gray line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {/* Color preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 pt-1">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
