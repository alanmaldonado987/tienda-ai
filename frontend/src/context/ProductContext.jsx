import { createContext, useContext, useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const ProductContext = createContext();

// Función para normalizar productos (asegurar campo images)
const normalizeProducts = (products) => {
  return products.map(product => ({
    ...product,
    images: product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : ['https://via.placeholder.com/400x533?text=No+Image']
  }));
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getAll(filters);
      setProducts(normalizeProducts(response.data.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getByCategory(category);
      setProducts(normalizeProducts(response.data.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        fetchProducts,
        fetchProductsByCategory
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
