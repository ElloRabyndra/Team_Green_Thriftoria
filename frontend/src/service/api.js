import axios from 'axios';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, redirect ke login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================
export const register = async (email, username, password) => {
  const response = await api.post('/auth/register', { email, username, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// ==================== USER PROFILE ENDPOINTS ====================
export const getDetailUser = async (userId) => {
  const response = await api.get(`/user/${userId}`);
  return response.data;
};

export const editProfile = async (userId, profileData) => {
  const response = await api.put(`/user/${userId}`, profileData);
  return response.data;
};

// ==================== PRODUCT ENDPOINTS ====================
export const getAllProduct = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductByCategory = async (category) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

export const searchProduct = async (query) => {
  const response = await api.get('/products/search', { params: { q: query } });
  return response.data;
};

export const getDetailProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const editProduct = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

// ==================== CART ENDPOINTS ====================
export const addToCart = async (userId, productId) => {
  const response = await api.post('/cart', { userId, productId });
  return response.data;
};

export const getAllCart = async (userId) => {
  const response = await api.get(`/cart/${userId}`);
  return response.data;
};

export const updateCartQuantity = async (cartId, quantity) => {
  const response = await api.put(`/cart/${cartId}`, { quantity });
  return response.data;
};

export const deleteCartItem = async (cartId) => {
  const response = await api.delete(`/cart/${cartId}`);
  return response.data;
};

// ==================== ORDER ENDPOINTS ====================
/**
 * Create new order
 * @param {Object} orderData - { userId, shopId, recipient, telephone, address, note, totalPrice, proofPayment, orderItems: [{productId, quantity, price}] }
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getAllOrder = async (userId) => {
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};

export const getAllOrderHistory = async (userId) => {
  const response = await api.get(`/orders/history/${userId}`);
  return response.data;
};

export const getOrderDetail = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId, userRole) => {
  const response = await api.put(`/orders/${orderId}/cancel`, { userRole });
  return response.data;
};

export const rejectCancel = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/reject-cancel`);
  return response.data;
};

export const acceptCancel = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/accept-cancel`);
  return response.data;
};

// ==================== SHOP ENDPOINTS ====================
/**
 * Create new shop
 * @param {Object} shopData - { userId, shopName, shopTelephone, shopAddress, accountNumber, qrisPicture }
 */
export const createShop = async (shopData) => {
  const response = await api.post('/shops', shopData);
  return response.data;
};

export const getDetailShop = async (shopId) => {
  const response = await api.get(`/shops/${shopId}`);
  return response.data;
};

export const editShop = async (shopId, shopData) => {
  const response = await api.put(`/shops/${shopId}`, shopData);
  return response.data;
};

// ==================== SALES ENDPOINTS (SELLER) ====================
export const getAllSales = async (shopId) => {
  const response = await api.get(`/sales/shop/${shopId}`);
  return response.data;
};

/**
 * Accept or reject payment
 * @param {number} orderId 
 * @param {boolean} status - true to accept, false to reject
 */
export const acceptPayment = async (orderId, status) => {
  const response = await api.put(`/sales/${orderId}/payment`, { status });
  return response.data;
};

/**
 * Change order shipping status
 * @param {number} orderId 
 * @param {string} statusShipping - awaitingPayment, prepared, shipped, delivered, cancelPending, cancelled
 */
export const changeStatusShipping = async (orderId, statusShipping) => {
  const response = await api.put(`/sales/${orderId}/status`, { statusShipping });
  return response.data;
};

// ==================== ADMIN ENDPOINTS ====================
export const getAllShop = async () => {
  const response = await api.get('/admin/shops');
  return response.data;
};

export const getRequestShop = async () => {
  const response = await api.get('/admin/shops/requests');
  return response.data;
};

/**
 * Accept or reject shop registration
 * @param {number} shopId 
 * @param {boolean} status - true to accept, false to reject
 */
export const acceptRequestShop = async (shopId, status) => {
  const response = await api.put(`/admin/shops/${shopId}/approve`, { status });
  return response.data;
};

export const getAllUser = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// ==================== UTILITY ====================
/**
 * Set authorization token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Remove token and logout
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common['Authorization'];
};

// Export axios instance untuk custom requests
export { api };

export default api;