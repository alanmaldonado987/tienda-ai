import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Importante para enviar cookies
});

// Request interceptor - agregar JWT
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

// Response interceptor - manejar 401 con refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no es una petición de refresh o login
    if (error.response?.status === 401 && 
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/refresh') &&
        !originalRequest.url.includes('/auth/login') &&
        !originalRequest.url.includes('/auth/register')) {
      
      // Si ya está refrescando, agregar a la cola
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refresh del token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { token } = response.data.data;
        
        // Guardar nuevo token
        localStorage.setItem('nafnaf-token', token);
        
        // Reintentar las peticiones fallidas
        processQueue(null, token);
        
        // Reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh falló, limpiar y redirigir al login
        processQueue(refreshError, null);
        localStorage.removeItem('nafnaf-token');
        localStorage.removeItem('nafnaf-user');
        
        // Solo redirigir si no estamos ya en /auth
        if (window.location.pathname !== '/auth') {
          window.location.replace('/auth');
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  logoutAll: () => api.post('/auth/logout-all'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
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

export const paymentAPI = {
  createPreference: (data) => api.post('/payments/create-preference', data),
  getStatus: (orderId) => api.get(`/payments/order/${orderId}`),
  verify: (orderId) => api.post(`/payments/verify/${orderId}`)
};

export const configAPI = {
  getAll: () => api.get('/config'),
  getValue: (key) => api.get(`/config/${key}`),
  update: (data) => api.put('/config', data)
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const couponsAPI = {
  getAll: () => api.get('/coupons'),
  getActive: () => api.get('/coupons/active'),
  getById: (id) => api.get(`/coupons/${id}`),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
  validate: (code, purchaseAmount) => api.post('/coupons/validate', { code, purchaseAmount })
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  getById: (id) => api.get(`/inventory/${id}`),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  adjust: (id, adjustment, reason) => api.post(`/inventory/${id}/adjust`, { adjustment, reason })
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getSalesChart: (days) => api.get('/dashboard/sales-chart', { params: { days } })
};

export const adminOrdersAPI = {
  getAll: () => api.get('/orders/admin/all'),
  updateStatus: (id, status) => api.put(`/orders/admin/${id}/status`, { status })
};

export const adminUsersAPI = {
  getAll: (params) => api.get('/admin/users', { params }),
  getById: (id) => api.get(`/admin/users/${id}`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  toggleBan: (id, banned, reason) => api.put(`/admin/users/${id}/ban`, { banned, reason }),
  delete: (id) => api.delete(`/admin/users/${id}`)
};

export default api;
