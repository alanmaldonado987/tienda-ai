import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Helper para obtener la primera imagen
  const getProductImage = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return product.image || 'https://via.placeholder.com/400x533?text=No+Image';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (product) => {
    addToCart(product, product.sizes?.[0] || 'Único', product.colors?.[0] || '#000000');
    removeFromWishlist(product.id);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">MIS FAVORITOS</h1>
          <p className="text-gray-500">{wishlist.length} productos</p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Vaciar lista
          </button>
        )}
      </div>

      {/* Empty state */}
      {wishlist.length === 0 && (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">Tu lista de favoritos está vacía</h2>
          <p className="text-gray-500 mb-6">Agrega productos que te gusten para verlos aquí</p>
          <Link
            to="/"
            className="inline-block bg-naf-black text-white px-6 py-3 text-sm tracking-wider hover:bg-naf-gray transition-colors"
          >
            VER PRODUCTOS
          </Link>
        </div>
      )}

      {/* Wishlist grid */}
      {wishlist.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="group relative bg-white border border-gray-100">
              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white border border-gray-200 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Image */}
              <Link to={`/product/${product.id}`}>
                <div className="aspect-[3/4] bg-naf-light-gray overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-sm font-medium mb-1 line-clamp-2 hover:text-naf-gray transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Add to cart */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-naf-black text-white py-2 text-sm tracking-wider hover:bg-naf-gray transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  AGREGAR AL CARRITO
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
