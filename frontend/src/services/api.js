import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Flag para evitar loop de redirects
let isRedirecting = false;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nafnaf-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Evitar loop infinito de redirects
    if (isRedirecting) {
      return Promise.reject(error);
    }

    // Ignorar errores de la página de auth
    if (window.location.pathname === '/auth') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      isRedirecting = true;
      // Token expirado o inválido
      localStorage.removeItem('nafnaf-token');
      localStorage.removeItem('nafnaf-user');
      window.location.replace('/auth');
    }
    return Promise.reject(error);
  }
);

// ===== AUTH =====
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data)
};

// ===== PRODUCTS =====
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`)
};

// ===== WISHLIST =====
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  toggle: (productId) => api.post(`/wishlist/toggle/${productId}`)
};

// ===== CART =====
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (data) => api.put('/cart', data),
  remove: (productId, params) => api.delete(`/cart/${productId}`, { params }),
  clear: () => api.delete('/cart/clear')
};

// ===== SUPPORT =====
export const supportAPI = {
  chat: (message, sessionId) => api.post('/support/chat', { message, sessionId }),
  getTopics: () => api.get('/support/topics'),
  sendFeedback: (messageId, rating, comment) => api.post('/support/feedback', { messageId, rating, comment })
};

// ===== ORDERS =====
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.delete(`/orders/${id}`, { data: { reason } })
};

// ===== CONFIG =====
export const configAPI = {
  getAll: () => api.get('/config'),
  getValue: (key) => api.get(`/config/${key}`)
};

export default api;
