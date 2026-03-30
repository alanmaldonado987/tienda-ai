import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
let isRedirecting = false;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isRedirecting) {
      return Promise.reject(error);
    }

    if (window.location.pathname === '/auth') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      isRedirecting = true;
      localStorage.removeItem('nafnaf-token');
      localStorage.removeItem('nafnaf-user');
      window.location.replace('/auth');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`)
};

export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  toggle: (productId) => api.post(`/wishlist/toggle/${productId}`)
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (data) => api.put('/cart', data),
  remove: (productId, params) => api.delete(`/cart/${productId}`, { params }),
  clear: () => api.delete('/cart/clear')
};

export const supportAPI = {
  chat: (message, sessionId) => api.post('/support/chat', { message, sessionId }),
  getTopics: () => api.get('/support/topics'),
  sendFeedback: (messageId, rating, comment) => api.post('/support/feedback', { messageId, rating, comment })
};

export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.delete(`/orders/${id}`, { data: { reason } })
};

export const configAPI = {
  getAll: () => api.get('/config'),
  getValue: (key) => api.get(`/config/${key}`)
};

export default api;
