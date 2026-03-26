import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useModal } from '../components/ConfirmModal';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { openConfirm } = useModal();
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
    // Dispatch custom event para que FlyingProduct lo capture
    const event = new CustomEvent('triggerFlyingProduct', {
      detail: { productInfo, targetPosition }
    });
    window.dispatchEvent(event);
  };

  const addToCart = async (product, size, color, quantity = 1) => {
    // Verificar si el producto ya existe en el carrito para mostrar advertencia
    const existingItem = cart.find(
      item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
    );
    
    if (existingItem && existingItem.quantity > 1) {
      // Mostrar modal de confirmación
      const confirmed = await openConfirm({
        title: 'Producto existente',
        message: `Ya tienes ${existingItem.quantity} unidades de "${product.name}" en tu carrito.\n\nSi eliminas este producto del carrito, se eliminarán todas las ${existingItem.quantity} unidades.\n\n¿Deseas agregar ${quantity} más?`,
        confirmText: 'Agregar más',
        cancelText: 'Cancelar'
      });
      
      if (!confirmed) {
        return; // El usuario canceló
      }
    }

    if (!user) {
      // Sin usuario, guardar en localStorage
      setCart(prev => {
        const existing = prev.find(
          item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
        );
        if (existing) {
          return prev.map(item =>
            item.id === product.id && item.selectedSize === size && item.selectedColor === color
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, selectedSize: size, selectedColor: color, quantity }];
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

  const removeFromCart = async (productId, size, color, productName = 'este producto') => {
    // Verificar si el producto tiene más de 1 unidad
    const item = cart.find(
      i => i.id === productId && i.selectedSize === size && i.selectedColor === color
    );
    
    if (item && item.quantity > 1) {
      const confirmed = await openConfirm({
        title: 'Eliminar múltiples unidades',
        message: `Este producto tiene ${item.quantity} unidades en tu carrito.\n\nSi continúas, se eliminarán las ${item.quantity} unidades.\n\n¿Deseas eliminar todas las unidades?`,
        confirmText: 'Eliminar todo',
        cancelText: 'Cancelar'
      });
      
      if (!confirmed) {
        return; // El usuario canceló
      }
    }

    if (!user) {
      setCart(prev =>
        prev.filter(
          item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
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
          item.id === productId && item.selectedSize === size && item.selectedColor === color
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