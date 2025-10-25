import axios from 'axios';

// API Configuration
const API_URL = "http://localhost:8080/api";
const USE_DUMMY = true; // Set false ketika backend sudah ready

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Delay helper untuk simulasi network request
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Dummy Data Store
const dummyStore = {
  users: [
    { id: 1, email: "buyer@test.com", username: "buyer1", telephone: "081234567890", address: "Jl. Test No. 123", role: "buyer", profilePicture: null }
  ],
  products: [
    { id: 1, shopId: 1, name: "Vintage T-Shirt", category: "Fashion", label: "Like New", description: "Kaos vintage berkualitas", image: "https://via.placeholder.com/300", price: 75000, stock: 10 },
    { id: 2, shopId: 1, name: "Denim Jacket", category: "Fashion", label: "Good", description: "Jaket denim stylish", image: "https://via.placeholder.com/300", price: 150000, stock: 5 },
    { id: 3, shopId: 2, name: "Wireless Mouse", category: "Others", label: "Like New", description: "Mouse wireless mulus", image: "https://via.placeholder.com/300", price: 50000, stock: 15 }
  ],
  shops: [
    { id: 1, userId: 2, shopName: "Thrift Store 1", shopTelephone: "081234567891", shopAddress: "Jl. Shop No. 1", accountNumber: "1234567890", qrisPicture: null, createdAt: new Date().toISOString(), statusAdmin: "accept" },
    { id: 2, userId: 3, shopName: "Thrift Store 2", shopTelephone: "081234567892", shopAddress: "Jl. Shop No. 2", accountNumber: "0987654321", qrisPicture: null, createdAt: new Date().toISOString(), statusAdmin: "pending" }
  ],
  cart: [],
  orders: [],
  orderItems: []
};

// ==================== AUTH ENDPOINTS ====================
export const register = async (email, username, password) => {
  if (USE_DUMMY) {
    await delay();
    const newUser = {
      id: dummyStore.users.length + 1,
      email,
      username,
      telephone: null,
      address: null,
      role: "buyer",
      profilePicture: null
    };
    dummyStore.users.push(newUser);
    return { success: true, message: "Register berhasil", data: newUser };
  }
  
  const response = await api.post('/auth/register', { email, username, password });
  return response.data;
};

export const login = async (email, password) => {
  if (USE_DUMMY) {
    await delay();
    const user = dummyStore.users.find(u => u.email === email);
    if (user) {
      return { success: true, message: "Login berhasil", data: { ...user, token: "dummy-token-123" } };
    }
    throw new Error("User tidak ditemukan");
  }
  
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// ==================== USER PROFILE ENDPOINTS ====================
export const getDetailUser = async (userId) => {
  if (USE_DUMMY) {
    await delay();
    const user = dummyStore.users.find(u => u.id === userId);
    return { success: true, data: user };
  }
  
  const response = await api.get(`/user/${userId}`);
  return response.data;
};

export const editProfile = async (userId, profileData) => {
  if (USE_DUMMY) {
    await delay();
    const userIndex = dummyStore.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      dummyStore.users[userIndex] = { ...dummyStore.users[userIndex], ...profileData };
      return { success: true, message: "Profile updated", data: dummyStore.users[userIndex] };
    }
    throw new Error("User tidak ditemukan");
  }
  
  const response = await api.put(`/user/${userId}`, profileData);
  return response.data;
};

// ==================== PRODUCT ENDPOINTS ====================
export const getAllProduct = async () => {
  if (USE_DUMMY) {
    await delay();
    return { success: true, data: dummyStore.products };
  }
  
  const response = await api.get('/products');
  return response.data;
};

export const getProductByCategory = async (category) => {
  if (USE_DUMMY) {
    await delay();
    const filtered = dummyStore.products.filter(p => p.category === category);
    return { success: true, data: filtered };
  }
  
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

export const searchProduct = async (query) => {
  if (USE_DUMMY) {
    await delay();
    const filtered = dummyStore.products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    return { success: true, data: filtered };
  }
  
  const response = await api.get('/products/search', { params: { q: query } });
  return response.data;
};

export const getDetailProduct = async (productId) => {
  if (USE_DUMMY) {
    await delay();
    const product = dummyStore.products.find(p => p.id === productId);
    return { success: true, data: product };
  }
  
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const editProduct = async (productId, productData) => {
  if (USE_DUMMY) {
    await delay();
    const index = dummyStore.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      dummyStore.products[index] = { ...dummyStore.products[index], ...productData };
      return { success: true, message: "Product updated", data: dummyStore.products[index] };
    }
    throw new Error("Product tidak ditemukan");
  }
  
  const response = await api.put(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  if (USE_DUMMY) {
    await delay();
    dummyStore.products = dummyStore.products.filter(p => p.id !== productId);
    return { success: true, message: "Product deleted" };
  }
  
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

// ==================== CART ENDPOINTS ====================
export const addToCart = async (userId, productId) => {
  if (USE_DUMMY) {
    await delay();
    const existing = dummyStore.cart.find(c => c.userId === userId && c.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      dummyStore.cart.push({
        id: dummyStore.cart.length + 1,
        userId,
        productId,
        quantity: 1
      });
    }
    return { success: true, message: "Added to cart" };
  }
  
  const response = await api.post('/cart', { userId, productId });
  return response.data;
};

export const getAllCart = async (userId) => {
  if (USE_DUMMY) {
    await delay();
    const userCart = dummyStore.cart.filter(c => c.userId === userId).map(c => {
      const product = dummyStore.products.find(p => p.id === c.productId);
      const shop = dummyStore.shops.find(s => s.id === product?.shopId);
      return {
        id: c.id,
        userId: c.userId,
        shopId: product?.shopId,
        productId: c.productId,
        image: product?.image,
        name: product?.name,
        label: product?.label,
        quantity: c.quantity,
        price: product?.price,
        shopName: shop?.shopName
      };
    });
    return { success: true, data: userCart };
  }
  
  const response = await api.get(`/cart/${userId}`);
  return response.data;
};

export const updateCartQuantity = async (cartId, quantity) => {
  if (USE_DUMMY) {
    await delay();
    const cart = dummyStore.cart.find(c => c.id === cartId);
    if (cart) {
      cart.quantity = quantity;
      return { success: true, message: "Cart updated" };
    }
    throw new Error("Cart item tidak ditemukan");
  }
  
  const response = await api.put(`/cart/${cartId}`, { quantity });
  return response.data;
};

export const deleteCartItem = async (cartId) => {
  if (USE_DUMMY) {
    await delay();
    dummyStore.cart = dummyStore.cart.filter(c => c.id !== cartId);
    return { success: true, message: "Cart item deleted" };
  }
  
  const response = await api.delete(`/cart/${cartId}`);
  return response.data;
};

// ==================== ORDER ENDPOINTS ====================
export const createOrder = async (orderData) => {
  if (USE_DUMMY) {
    await delay();
    const orderId = dummyStore.orders.length + 1;
    const newOrder = {
      id: orderId,
      userId: orderData.userId,
      shopId: orderData.shopId,
      recipient: orderData.recipient,
      telephone: orderData.telephone,
      address: orderData.address,
      note: orderData.note,
      totalPrice: orderData.totalPrice,
      proofPayment: orderData.proofPayment,
      cancelBy: null,
      statusShipping: "awaitingPayment",
      createdAt: new Date().toISOString(),
      deletedAt: null
    };
    dummyStore.orders.push(newOrder);
    
    // Create order items
    orderData.orderItems.forEach((item) => {
      dummyStore.orderItems.push({
        id: dummyStore.orderItems.length + 1,
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      });
    });
    
    return { success: true, message: "Order created", data: newOrder };
  }
  
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getAllOrder = async (userId) => {
  if (USE_DUMMY) {
    await delay();
    const userOrders = dummyStore.orders
      .filter(o => o.userId === userId && !["delivered", "cancelled"].includes(o.statusShipping.toLowerCase()))
      .map(o => {
        const shop = dummyStore.shops.find(s => s.id === o.shopId);
        const itemCount = dummyStore.orderItems.filter(oi => oi.orderId === o.id).length;
        return {
          orderId: o.id,
          shopId: o.shopId,
          shopName: shop?.shopName,
          shopPhone: shop?.shopTelephone,
          createdAt: o.createdAt,
          totalPrice: o.totalPrice,
          statusShipping: o.statusShipping,
          productCount: itemCount
        };
      });
    return { success: true, data: userOrders };
  }
  
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};

export const getAllOrderHistory = async (userId) => {
  if (USE_DUMMY) {
    await delay();
    const userOrders = dummyStore.orders
      .filter(o => o.userId === userId && ["delivered", "cancelled"].includes(o.statusShipping.toLowerCase()))
      .map(o => {
        const shop = dummyStore.shops.find(s => s.id === o.shopId);
        const itemCount = dummyStore.orderItems.filter(oi => oi.orderId === o.id).length;
        return {
          orderId: o.id,
          shopId: o.shopId,
          shopName: shop?.shopName,
          shopPhone: shop?.shopTelephone,
          createdAt: o.createdAt,
          totalPrice: o.totalPrice,
          statusShipping: o.statusShipping,
          productCount: itemCount
        };
      });
    return { success: true, data: userOrders };
  }
  
  const response = await api.get(`/orders/history/${userId}`);
  return response.data;
};

export const getOrderDetail = async (orderId) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find(o => o.id === orderId);
    const shop = dummyStore.shops.find(s => s.id === order?.shopId);
    const items = dummyStore.orderItems
      .filter(oi => oi.orderId === orderId)
      .map(oi => {
        const product = dummyStore.products.find(p => p.id === oi.productId);
        return {
          name: product?.name,
          label: product?.label,
          quantity: oi.quantity,
          price: oi.price,
          image: product?.image
        };
      });
    
    return {
      success: true,
      data: {
        orderId: order?.id,
        shopId: order?.shopId,
        shopName: shop?.shopName,
        shopPhone: shop?.shopTelephone,
        recipient: order?.recipient,
        telephone: order?.telephone,
        address: order?.address,
        note: order?.note,
        createdAt: order?.createdAt,
        statusShipping: order?.statusShipping,
        cancelBy: order?.cancelBy,
        totalPrice: order?.totalPrice,
        orderItems: items
      }
    };
  }
  
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId, userRole) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find(o => o.id === orderId);
    if (order) {
      order.statusShipping = "cancelPending";
      order.cancelBy = userRole;
      return { success: true, message: "Cancel request submitted" };
    }
    throw new Error("Order tidak ditemukan");
  }
  
  const response = await api.put(`/orders/${orderId}/cancel`, { userRole });
  return response.data;
};

export const rejectCancel = async (orderId) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find(o => o.id === orderId);
    if (order) {
      order.statusShipping = "prepared";
      order.cancelBy = null;
      return { success: true, message: "Cancel request rejected" };
    }
    throw new Error("Order tidak ditemukan");
  }
  
  const response = await api.put(`/orders/${orderId}/reject-cancel`);
  return response.data;
};

export const acceptCancel = async (orderId) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find(o => o.id === orderId);
    if (order) {
      order.statusShipping = "cancelled";
      order.deletedAt = new Date().toISOString();
      return { success: true, message: "Order cancelled" };
    }
    throw new Error("Order tidak ditemukan");
  }
  
  const response = await api.put(`/orders/${orderId}/accept-cancel`);
  return response.data;
};

// ==================== SHOP ENDPOINTS ====================
export const createShop = async (shopData) => {
  if (USE_DUMMY) {
    await delay();
    const newShop = {
      id: dummyStore.shops.length + 1,
      userId: shopData.userId,
      shopName: shopData.shopName,
      shopTelephone: shopData.shopTelephone,
      shopAddress: shopData.shopAddress,
      accountNumber: shopData.accountNumber,
      qrisPicture: shopData.qrisPicture,
      createdAt: new Date().toISOString(),
      statusAdmin: "pending"
    };
    dummyStore.shops.push(newShop);
    return { success: true, message: "Shop registration submitted", data: newShop };
  }
  
  const response = await api.post('/shops', shopData);
  return response.data;
};

export const getDetailShop = async (shopId) => {
  if (USE_DUMMY) {
    await delay();
    const shop = dummyStore.shops.find(s => s.id === shopId);
    const user = dummyStore.users.find(u => u.id === shop?.userId);
    return {
      success: true,
      data: {
        ...shop,
        username: user?.username,
        email: user?.email
      }
    };
  }
  
  const response = await api.get(`/shops/${shopId}`);
  return response.data;
};

export const editShop = async (shopId, shopData) => {
  if (USE_DUMMY) {
    await delay();
    const index = dummyStore.shops.findIndex(s => s.id === shopId);
    if (index !== -1) {
      dummyStore.shops[index] = { ...dummyStore.shops[index], ...shopData };
      return { success: true, message: "Shop updated", data: dummyStore.shops[index] };
    }
    throw new Error("Shop tidak ditemukan");
  }
  
  const response = await api.put(`/shops/${shopId}`, shopData);
  return response.data;
};

// ==================== SALES ENDPOINTS (SELLER) ====================
export const getAllSales = async (shopId) => {
  if (USE_DUMMY) {
    await delay();
    const shopOrders = dummyStore.orders
      .filter(o => o.shopId === shopId)
      .map(o => {
        const itemCount = dummyStore.orderItems.filter(oi => oi.orderId === o.id).length;
        return {
          orderId: o.id,
          shopId: o.shopId,
          recipient: o.recipient,
          telephone: o.telephone,
          createdAt: o.createdAt,
          totalPrice: o.totalPrice,
          statusShipping: o.statusShipping,
          productCount: itemCount
        };
      });
    return { success: true, data: shopOrders };
  }
  
  const response = await api.get(`/sales/shop/${shopId}`);
  return response.data;
};

export const acceptPayment = async (orderId, status) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find(o => o.id === orderId);
    if (order) {
      if (status) {
        order.statusShipping = "prepared";
      } else {
        order.statusShipping = "cancelled";
        order.cancelBy = "seller";
      }
      return { success: true, message: status ? "Payment accepted" : "Payment rejected" };
    }
    throw new Error("Order tidak ditemukan");
  }
  
  const response = await api.put(`/sales/${orderId}/payment`, { status });
  return response.data;
};

export const changeStatusShipping = async (orderId, statusShipping) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find(o => o.id === orderId);
    if (order) {
      order.statusShipping = statusShipping;
      if (statusShipping === "cancelPending") {
        order.cancelBy = "seller";
      }
      return { success: true, message: "Status updated" };
    }
    throw new Error("Order tidak ditemukan");
  }
  
  const response = await api.put(`/sales/${orderId}/status`, { statusShipping });
  return response.data;
};

// ==================== ADMIN ENDPOINTS ====================
export const getAllShop = async () => {
  if (USE_DUMMY) {
    await delay();
    const accepted = dummyStore.shops.filter(s => s.statusAdmin === "accept");
    return { success: true, data: accepted };
  }
  
  const response = await api.get('/admin/shops');
  return response.data;
};

export const getRequestShop = async () => {
  if (USE_DUMMY) {
    await delay();
    const pending = dummyStore.shops.filter(s => s.statusAdmin === "pending");
    return { success: true, data: pending };
  }
  
  const response = await api.get('/admin/shops/requests');
  return response.data;
};

export const acceptRequestShop = async (shopId, status) => {
  if (USE_DUMMY) {
    await delay();
    const index = dummyStore.shops.findIndex(s => s.id === shopId);
    if (index !== -1) {
      if (status) {
        dummyStore.shops[index].statusAdmin = "accept";
        return { success: true, message: "Shop approved" };
      } else {
        dummyStore.shops.splice(index, 1);
        return { success: true, message: "Shop rejected" };
      }
    }
    throw new Error("Shop tidak ditemukan");
  }
  
  const response = await api.put(`/admin/shops/${shopId}/approve`, { status });
  return response.data;
};

export const getAllUser = async () => {
  if (USE_DUMMY) {
    await delay();
    return { success: true, data: dummyStore.users };
  }
  
  const response = await api.get('/admin/users');
  return response.data;
};

// ==================== UTILITY ====================
// Set authorization token (panggil setelah login)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Export axios instance untuk custom requests
export { api };

// Export dummy store untuk debugging (opsional)
export const getDummyStore = () => dummyStore;