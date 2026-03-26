import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar carrito de la API cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Si no hay usuario, cargar desde localStorage
      const saved = localStorage.getItem('nafnaf-cart');
      setCart(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  // Guardar en localStorage cuando cambia carrito (solo para usuarios no logueados)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('nafnaf-cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartAPI.get();
      setCart(response.data.data.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      // Si hay error, usar localStorage
      const saved = localStorage.getItem('nafnaf-cart');
      setCart(saved ? JSON.parse(saved) : []);
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar la animación de vuelo al carrito
  const triggerFlyingProduct = (productInfo, targetPosition) => {
    setFlyingProduct({
      ...productInfo,
      targetX: targetPosition?.x || 0,
      targetY: targetPosition?.y || 0
    });
    // Limpiar después de la animación
    setTimeout(() => {
      setFlyingProduct(null);
    }, 1000);
  };

  const addToCart = async (product, size, color, quantity = 1) => {
    if (!user) {
      // Sin usuario, guardar en localStorage
      setCart(prev => {
        const existing = prev.find(
          item => item.id === product.id && item.size === size && item.color === color
        );
        if (existing) {
          return prev.map(item =>
            item.id === product.id && item.size === size && item.color === color
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, size, color, quantity }];
      });
      return;
    }

    try {
      const response = await cartAPI.add({
        productId: product.id,
        quantity,
        selectedSize: size,
        selectedColor: color
      });
      setCart(response.data.data.items || []);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const removeFromCart = async (productId, size, color) => {
    if (!user) {
      setCart(prev =>
        prev.filter(
          item => !(item.id === productId && item.size === size && item.color === color)
        )
      );
      return;
    }

    try {
      const response = await cartAPI.remove(productId, {
        selectedColor: color,
        selectedSize: size
      });
      setCart(response.data.data.items || []);
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const updateQuantity = async (productId, size, color, quantity) => {
    if (!user) {
      if (quantity <= 0) {
        removeFromCart(productId, size, color);
        return;
      }
      setCart(prev =>
        prev.map(item =>
          item.id === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        )
      );
      return;
    }

    try {
      const response = await cartAPI.update({
        productId,
        quantity,
        selectedSize: size,
        selectedColor: color
      });
      setCart(response.data.data.items || []);
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  };

  const clearCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      await cartAPI.clear();
      setCart([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        refreshCart: fetchCart,
        triggerFlyingProduct
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}