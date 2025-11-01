import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Response interceptor untuk handle error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================

// Fungsi API untuk Register
export const registerApi = (data) => api.post("/register", data);

// Fungsi API untuk Login
export const loginApi = (data) => api.post("/login", data);

// Fungsi API untuk Logout
export const logoutApi = () => api.post("/logout");

// ==================== USER PROFILE ENDPOINTS ====================

// Fungsi API untuk mendapatkan Profile
export const getProfileApi = () => api.get("/user/profile");

// Fungsi API untuk update Profile
export const updateProfileApi = (data) => {
  const formData = new FormData();

  formData.append("username", data.username || "");
  formData.append("email", data.email || "");
  formData.append("address", data.address || "");
  formData.append("telephone", data.telephone || "");
  formData.append("old_password", data.old_password || "");
  formData.append("new_password", data.new_password || "");

  const profilePic = data.profile_picture;

  if (profilePic && profilePic instanceof File) {
    formData.append("profile_picture", profilePic, profilePic.name);
  }

  return api.patch("/user/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==================== PRODUCT ENDPOINTS ====================
export const getAllProduct = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductByCategory = async (category) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

export const searchProduct = async (query) => {
  const response = await api.get("/products/search", { params: { q: query } });
  return response.data;
};

export const getDetailProduct = async (product_id) => {
  const response = await api.get(`/products/${product_id}`);
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

export const editProduct = async (product_id, productData) => {
  const response = await api.put(`/products/${product_id}`, productData);
  return response.data;
};

export const deleteProduct = async (product_id) => {
  const response = await api.delete(`/products/${product_id}`);
  return response.data;
};

// ==================== CART ENDPOINTS ====================
export const addToCart = async (user_id, product_id) => {
  const response = await api.post("/cart", { user_id, product_id });
  return response.data;
};

export const getAllCart = async (user_id) => {
  const response = await api.get(`/cart/${user_id}`);
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
 * @param {Object} orderData - { user_id, shop_id, recipient, telephone, address, note, total_price, proof_payment, orderItems: [{product_id, quantity, price}] }
 */
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getAllOrder = async (user_id) => {
  const response = await api.get(`/orders/user/${user_id}`);
  return response.data;
};

export const getAllOrderHistory = async (user_id) => {
  const response = await api.get(`/orders/history/${user_id}`);
  return response.data;
};

export const getOrderDetail = async (order_id) => {
  const response = await api.get(`/orders/${order_id}`);
  return response.data;
};

export const cancelOrder = async (order_id, userRole) => {
  const response = await api.put(`/orders/${order_id}/cancel`, { userRole });
  return response.data;
};

export const rejectCancel = async (order_id) => {
  const response = await api.put(`/orders/${order_id}/reject-cancel`);
  return response.data;
};

export const acceptCancel = async (order_id) => {
  const response = await api.put(`/orders/${order_id}/accept-cancel`);
  return response.data;
};

// ==================== SHOP ENDPOINTS ====================
/**
 * Create new shop
 * @param {Object} shopData - { user_id, shop_name, shop_telephone, shop_address, account_number, qris_picture }
 */
export const createShop = async (shopData) => {
  const response = await api.post("/shops", shopData);
  return response.data;
};

export const getDetailShop = async (shop_id) => {
  const response = await api.get(`/shops/${shop_id}`);
  return response.data;
};

export const editShop = async (shop_id, shopData) => {
  const response = await api.put(`/shops/${shop_id}`, shopData);
  return response.data;
};

// ==================== SALES ENDPOINTS (SELLER) ====================
export const getAllSales = async (shop_id) => {
  const response = await api.get(`/sales/shop/${shop_id}`);
  return response.data;
};

/**
 * Accept or reject payment
 * @param {number} order_id
 * @param {boolean} status - true to accept, false to reject
 */
export const acceptPayment = async (order_id, status) => {
  const response = await api.put(`/sales/${order_id}/payment`, { status });
  return response.data;
};

/**
 * Change order shipping status
 * @param {number} order_id
 * @param {string} status_shipping - awaitingPayment, prepared, shipped, delivered, cancelPending, cancelled
 */
export const changeStatusShipping = async (order_id, status_shipping) => {
  const response = await api.put(`/sales/${order_id}/status`, {
    status_shipping,
  });
  return response.data;
};

// ==================== ADMIN ENDPOINTS ====================
export const getAllShop = async () => {
  const response = await api.get("/admin/shops");
  return response.data;
};

export const getRequestShop = async () => {
  const response = await api.get("/admin/shops/requests");
  return response.data;
};

/**
 * Accept or reject shop registration
 * @param {number} shop_id
 * @param {boolean} status - true to accept, false to reject
 */
export const acceptRequestShop = async (shop_id, status) => {
  const response = await api.put(`/admin/shops/${shop_id}/approve`, { status });
  return response.data;
};

export const getAllUser = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// ==================== UTILITY ====================
/**
 * Set authorization token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

/**
 * Remove token and logout
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete api.defaults.headers.common["Authorization"];
};

// Export axios instance untuk custom requests
export { api };

export default api;
