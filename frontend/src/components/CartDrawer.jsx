import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white animate-slide-in overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Mi Carrito</h2>
            <span className="bg-naf-black text-white text-xs px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-naf-light-gray transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-naf-gray mb-4">Tu carrito está vacío</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-naf-black text-white px-6 py-2 text-sm tracking-wider hover:bg-naf-gray transition-colors"
              >
                CONTINUAR COMPRANDO
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-4 pb-4 border-b"
                >
                  {/* Image */}
                  <div className="w-20 h-24 bg-naf-light-gray flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-naf-gray mb-2">
                      Talla: {item.selectedSize || 'Único'} | Color: {item.selectedColor || 'N/A'}
                    </p>
                    <p className="text-sm font-semibold mb-3">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          className="p-1 hover:bg-naf-light-gray transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          className="p-1 hover:bg-naf-light-gray transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                        className="p-1 text-naf-gray hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-naf-gray">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-naf-gray">Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button className="w-full bg-naf-black text-white py-4 text-sm tracking-wider hover:bg-naf-gray transition-colors">
              FINALIZAR COMPRA
            </button>

            {/* Continue shopping */}
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full text-center text-sm text-naf-gray hover:text-naf-black transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
