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

// ==================== CART ENDPOINTS ====================

// ==================== ORDER ENDPOINTS ====================

// ==================== SALES ENDPOINTS (SELLER) ====================

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
