import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar wishlist de la API cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      // Si no hay usuario, cargar desde localStorage
      const saved = localStorage.getItem('nafnaf-wishlist');
      setWishlist(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  // Guardar en localStorage cuando cambia wishlist (solo para usuarios no logueados)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('nafnaf-wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await wishlistAPI.getAll();
      setWishlist(response.data.data || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.message);
      // Si hay error (ej: no autorizado), usar localStorage
      const saved = localStorage.getItem('nafnaf-wishlist');
      setWishlist(saved ? JSON.parse(saved) : []);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      // Sin usuario, guardar en localStorage
      setWishlist(prev => {
        const exists = prev.find(item => item.id === product.id);
        if (exists) return prev;
        return [...prev, product];
      });
      return;
    }

    try {
      await wishlistAPI.add(product.id);
      setWishlist(prev => {
        const exists = prev.find(item => item.id === product.id);
        if (exists) return prev;
        return [...prev, product];
      });
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) {
      setWishlist(prev => prev.filter(item => item.id !== productId));
      return;
    }

    try {
      await wishlistAPI.remove(productId);
      setWishlist(prev => prev.filter(item => item.id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const toggleWishlist = async (product) => {
    const exists = wishlist.find(item => item.id === product.id);
    
    if (!user) {
      if (exists) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
      return;
    }

    try {
      const response = await wishlistAPI.toggle(product.id);
      if (response.data.data.isFavorite) {
        setWishlist(prev => {
          const exists = prev.find(item => item.id === product.id);
          if (exists) return prev;
          return [...prev, product];
        });
      } else {
        setWishlist(prev => prev.filter(item => item.id !== product.id));
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const clearWishlist = () => {
    setWishlist([]);
    if (!user) {
      localStorage.removeItem('nafnaf-wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        refreshWishlist: fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
