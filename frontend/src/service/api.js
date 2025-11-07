import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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

// ==================== SHOP ENDPOINTS ====================

// Fungsi API untuk membuat Shop baru
export const createShopApi = (data) => {
  const formData = new FormData(); // Append field teks

  formData.append("shop_name", data.shop_name || "");
  formData.append("shop_telephone", data.shop_telephone || "");
  formData.append("shop_address", data.shop_address || "");
  formData.append("account_number", data.account_number || "");

  // Append file (qris_picture)
  const qrisPic = data.qris_picture;
  if (qrisPic && qrisPic instanceof File) {
    formData.append("qris_picture", qrisPic, qrisPic.name);
  }

  return api.post("/shop", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Fungsi API untuk mendapatkan Detail Shop
export const getShopDetailApi = (shopId) => {
  return api.get(`/shop/${shopId}`);
};

// Fungsi API untuk mengedit Shop
export const editShopApi = (shopId, data) => {
  const formData = new FormData(); // Append field teks

  formData.append("shop_name", data.shop_name || "");
  formData.append("shop_telephone", data.shop_telephone || "");
  formData.append("shop_address", data.shop_address || "");
  formData.append("account_number", data.account_number || "");

  // Append file (qris_picture)
  const qrisPic = data.qris_picture;
  if (qrisPic && qrisPic instanceof File) {
    formData.append("qris_picture", qrisPic, qrisPic.name);
  }

  return api.patch(`/shop/${shopId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==================== PRODUCT ENDPOINTS ====================

// Fungsi API untuk mendapatkan semua produk
export const getAllProductsApi = () => api.get("/products");

// Fungsi API untuk mencari produk
export const searchProductApi = (query) =>
  api.get(`/products/search?q=${query}`);

// Fungsi API untuk mendapatkan produk berdasarkan kategori
export const getProductByCategoryApi = (category) =>
  api.get(`/products/category/${category}`);

// Fungsi API untuk mendapatkan detail produk
export const getDetailProductApi = (productId) =>
  api.get(`/products/${productId}`);

// Fungsi API untuk menambah produk
export const addProductApi = (data) => {
  const formData = new FormData();

  formData.append("name", data.name || "");
  formData.append("category", data.category || "");
  formData.append("label", data.label || "");
  formData.append("description", data.description || "");
  formData.append("price", data.price?.toString() || "0");
  formData.append("stock", data.stock?.toString() || "0");

  const fileList = data.image;
  const imageFile = fileList?.[0];

  if (imageFile && imageFile instanceof File) {
    formData.append("image", imageFile, imageFile.name);
  }

  return api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Fungsi API untuk mengedit produk
export const editProductApi = (productId, data) => {
  const formData = new FormData();

  // Append text fields
  formData.append("name", data.name || "");
  formData.append("category", data.category || "");
  formData.append("label", data.label || "");
  formData.append("description", data.description || "");
  formData.append("price", data.price?.toString() || "0");
  formData.append("stock", data.stock?.toString() || "0");

  const fileList = data.image;
  const imageFile = fileList?.[0];

  if (imageFile && imageFile instanceof File) {
    formData.append("image", imageFile, imageFile.name);
  }

  return api.patch(`/products/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Fungsi API untuk menghapus produk - HANYA SELLER (DELETE /products/:id)
export const deleteProductApi = (productId) =>
  api.delete(`/products/${productId}`);

// ==================== CART ENDPOINTS ====================

// Fungsi API untuk mendapatkan semua item keranjang (GET /cart)
export const getAllCartApi = () => api.get("/cart");

// Fungsi API untuk menambah produk ke keranjang
export const addToCartApi = (productId) =>
  api.post("/cart", { product_id: productId });

// Fungsi API untuk mengedit kuantitas item keranjang
export const updateCartQuantityApi = (cartId, quantity) =>
  api.patch(`/cart/${cartId}`, { quantity });

// Fungsi API untuk menghapus item keranjang
export const deleteCartItemApi = (cartId) => api.delete(`/cart/${cartId}`);

// ==================== ORDER ENDPOINTS ====================

export const createOrderApi = (data) => {
  const formData = new FormData();

  // Append data teks dan angka
  formData.append("shop_id", data.shop_id.toString());
  formData.append("recipient", data.recipient || "");
  formData.append("telephone", data.telephone || "");
  formData.append("address", data.address || "");
  formData.append("note", data.note || "");

  const imageFile = data.proof_payment;

  if (imageFile instanceof File) {
    formData.append("proof_payment", imageFile, imageFile.name);
  } else {
    console.error("proof_payment is not a File object", imageFile);
  }

  if (data.cart_ids && Array.isArray(data.cart_ids)) {
    data.cart_ids.forEach((id) => {
      formData.append("cart_ids[]", id.toString());
    });
  }

  return api.post("/orders", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllActiveOrdersApi = () => api.get("/orders");

export const getOrderHistoryApi = () => api.get("/orders/history");

export const getOrderDetailApi = (orderId) => api.get(`/orders/${orderId}`);

export const requestOrderCancellationApi = (orderId, cancelRole) =>
  api.patch(`/orders/${orderId}/cancel`, { cancel_role: cancelRole });

export const rejectOrderCancellationApi = (orderId) =>
  api.patch(`/orders/${orderId}/reject-cancel`);

export const acceptOrderCancellationApi = (orderId) =>
  api.patch(`/orders/${orderId}/accept-cancel`);

// ==================== SALES ENDPOINTS (SELLER) ====================

export const getAllSalesApi = (shopId) => api.get(`/orders/sales/${shopId}`);

export const acceptRejectPaymentApi = (orderId, status) =>
  api.patch(`/orders/${orderId}/accept-payment`, { status });

export const updateShippingStatusApi = (orderId, status_shipping) =>
  api.patch(`/orders/${orderId}/status`, { status_shipping });

// ==================== ADMIN ENDPOINTS ====================

// Fungsi API untuk mendapatkan semua user
export const getAllUserApi = () => api.get("/user");

// Fungsi API untuk mendapatkan user berdasarkan Id
export const getUserByIdApi = (user_id) => api.get(`/user/${user_id}`);

// Fungsi API untuk mendapatkan semua shop
export const getAllShopApproveApi = () => api.get("/shop/approve");

// Fungsi API untuk mendapatkan pending shop
export const getAllShopPendingApi = () => api.get("/shop/pending");

// Fungsi API untuk mengubah status shop
export const reviewShopRequestApi = (shopId, status) => {
  return api.patch("/shop/accept", {
    shop_id: shopId,
    status: status,
  });
};

export default api;
