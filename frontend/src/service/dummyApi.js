import axios from "axios";
import { dummyStore } from "@/database/dummyStore";

// API Configuration
const API_URL = "http://localhost:8080/api";
const USE_DUMMY = true; // Set false ketika backend sudah ready

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Delay helper untuk simulasi network request
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

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
      profile_picture: null,
    };
    dummyStore.users.push(newUser);
    return { success: true, message: "Register berhasil", data: newUser };
  }

  const response = await api.post("/auth/register", {
    email,
    username,
    password,
  });
  return response.data;
};

export const login = async (email, password) => {
  if (USE_DUMMY) {
    await delay();
    const user = dummyStore.users.find((u) => u.email === email);
    if (user) {
      return {
        success: true,
        message: "Login berhasil",
        data: { ...user, token: "dummy-token-123" },
      };
    }
    throw new Error("User tidak ditemukan");
  }

  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// ==================== USER PROFILE ENDPOINTS ====================
export const getDetailUser = async (user_id) => {
  if (USE_DUMMY) {
    await delay();
    const user = dummyStore.users.find((u) => u.id === user_id);
    return { success: true, data: user };
  }

  const response = await api.get(`/user/${user_id}`);
  return response.data;
};

export const editProfile = async (user_id, profileData) => {
  if (USE_DUMMY) {
    await delay();
    const userIndex = dummyStore.users.findIndex((u) => u.id === user_id);
    if (userIndex !== -1) {
      dummyStore.users[userIndex] = {
        ...dummyStore.users[userIndex],
        ...profileData,
      };
      return {
        success: true,
        message: "Profile updated",
        data: dummyStore.users[userIndex],
      };
    }
    throw new Error("User tidak ditemukan");
  }

  const response = await api.put(`/user/${user_id}`, profileData);
  return response.data;
};

// ==================== PRODUCT ENDPOINTS ====================
export const getAllProduct = async () => {
  if (USE_DUMMY) {
    await delay();
    return { success: true, data: dummyStore.products };
  }

  const response = await api.get("/products");
  return response.data;
};

export const getProductByCategory = async (category) => {
  if (USE_DUMMY) {
    await delay();
    const filtered = dummyStore.products.filter(
      (p) => p.category.toLowerCase() === category
    );
    return { success: true, data: filtered };
  }

  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

export const searchProduct = async (query) => {
  if (USE_DUMMY) {
    await delay();
    const filtered = dummyStore.products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    return { success: true, data: filtered };
  }

  const response = await api.get("/products/search", { params: { q: query } });
  return response.data;
};

export const getDetailProduct = async (product_id) => {
  if (USE_DUMMY) {
    await delay();
    const product = dummyStore.products.find((p) => p.id === product_id);
    return { success: true, data: product };
  }

  const response = await api.get(`/products/${product_id}`);
  return response.data;
};

export const addProduct = async (
  shop_id,
  name,
  category,
  label,
  description,
  image,
  price,
  stock
) => {
  if (USE_DUMMY) {
    await delay();

    // Generate new ID
    const newId =
      dummyStore.products.length > 0
        ? Math.max(...dummyStore.products.map((p) => p.id)) + 1
        : 1;

    const newProduct = {
      id: newId,
      shop_id,
      name,
      category,
      label,
      description,
      image: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
      price: parseFloat(price),
      stock: parseInt(stock),
    };

    dummyStore.products.push(newProduct);

    return {
      success: true,
      message: "Product added successfully",
      data: newProduct,
    };
  }

  const response = await api.post("/products", {
    shop_id,
    name,
    category,
    label,
    description,
    image,
    price,
    stock,
  });
  return response.data;
};

export const editProduct = async (product_id, productData) => {
  if (USE_DUMMY) {
    await delay();
    const index = dummyStore.products.findIndex((p) => p.id === product_id);
    if (index !== -1) {
      dummyStore.products[index] = {
        ...dummyStore.products[index],
        ...productData,
      };
      return {
        success: true,
        message: "Product updated",
        data: dummyStore.products[index],
      };
    }
    throw new Error("Product tidak ditemukan");
  }

  const response = await api.put(`/products/${product_id}`, productData);
  return response.data;
};

export const deleteProduct = async (product_id) => {
  if (USE_DUMMY) {
    await delay();
    dummyStore.products = dummyStore.products.filter(
      (p) => p.id !== product_id
    );
    return { success: true, message: "Product deleted" };
  }

  const response = await api.delete(`/products/${product_id}`);
  return response.data;
};

// ==================== CART ENDPOINTS ====================
export const addToCart = async (user_id, product_id) => {
  if (USE_DUMMY) {
    await delay();
    const existing = dummyStore.cart.find(
      (c) => c.user_id === user_id && c.product_id === product_id
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      dummyStore.cart.push({
        id: dummyStore.cart.length + 1,
        user_id,
        product_id,
        quantity: 1,
      });
    }
    return { success: true, message: "Added to cart" };
  }

  const response = await api.post("/cart", { user_id, product_id });
  return response.data;
};

export const getAllCart = async (user_id) => {
  if (USE_DUMMY) {
    await delay();
    const userCart = dummyStore.cart
      .filter((c) => c.user_id === user_id)
      .map((c) => {
        const product = dummyStore.products.find((p) => p.id === c.product_id);
        const shop = dummyStore.shops.find((s) => s.id === product?.shop_id);
        return {
          id: c.id,
          user_id: c.user_id,
          shop_id: product?.shop_id,
          product_id: c.product_id,
          image: product?.image,
          name: product?.name,
          label: product?.label,
          quantity: c.quantity,
          price: product?.price,
          shop_name: shop?.shop_name,
        };
      });
    return { success: true, data: userCart };
  }

  const response = await api.get(`/cart/${user_id}`);
  return response.data;
};

export const updateCartQuantity = async (cartId, quantity) => {
  if (USE_DUMMY) {
    await delay();
    const cart = dummyStore.cart.find((c) => c.id === cartId);
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
    dummyStore.cart = dummyStore.cart.filter((c) => c.id !== cartId);
    return { success: true, message: "Cart item deleted" };
  }

  const response = await api.delete(`/cart/${cartId}`);
  return response.data;
};

// ==================== ORDER ENDPOINTS ====================
export const createOrder = async (orderData) => {
  if (USE_DUMMY) {
    await delay();
    const order_id = dummyStore.orders.length + 1;
    const newOrder = {
      id: order_id,
      user_id: orderData.user_id,
      shop_id: orderData.shop_id,
      recipient: orderData.recipient,
      telephone: orderData.telephone,
      address: orderData.address,
      note: orderData.note,
      total_price: orderData.total_price,
      proof_payment: orderData.proof_payment,
      cancelBy: null,
      status_shipping: "awaitingPayment",
      created_at: new Date().toISOString(),
      deleted_at: null,
    };
    dummyStore.orders.push(newOrder);

    // Create order items
    orderData.orderItems.forEach((item) => {
      dummyStore.orderItems.push({
        id: dummyStore.orderItems.length + 1,
        order_id: order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    });
    return { success: true, message: "Order created", data: newOrder };
  }

  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getAllOrder = async (user_id) => {
  if (USE_DUMMY) {
    await delay();
    const userOrders = dummyStore.orders
      .filter(
        (o) =>
          o.user_id === user_id &&
          !["delivered", "cancelled"].includes(o.status_shipping.toLowerCase())
      )
      .map((o) => {
        const shop = dummyStore.shops.find((s) => s.id === o.shop_id);
        const itemCount = dummyStore.orderItems.filter(
          (oi) => oi.id === o.id
        ).length;
        return {
          id: o.id,
          shop_id: o.shop_id,
          shop_name: shop?.shop_name,
          shop_telephone: shop?.shop_telephone,
          created_at: o.created_at,
          total_price: o.total_price,
          status_shipping: o.status_shipping,
          productCount: itemCount,
        };
      });
    return { success: true, data: userOrders };
  }

  const response = await api.get(`/orders/user/${user_id}`);
  return response.data;
};

export const getAllOrderHistory = async (user_id) => {
  if (USE_DUMMY) {
    await delay();
    const userOrders = dummyStore.orders
      .filter(
        (o) =>
          o.user_id === user_id &&
          ["delivered", "cancelled"].includes(o.status_shipping.toLowerCase())
      )
      .map((o) => {
        const shop = dummyStore.shops.find((s) => s.id === o.shop_id);
        const itemCount = dummyStore.orderItems.filter(
          (oi) => oi.order_id === o.id
        ).length;
        return {
          id: o.id,
          shop_id: o.shop_id,
          shop_name: shop?.shop_name,
          shop_telephone: shop?.shop_telephone,
          created_at: o.created_at,
          total_price: o.total_price,
          status_shipping: o.status_shipping,
          productCount: itemCount,
        };
      });
    return { success: true, data: userOrders };
  }

  const response = await api.get(`/orders/history/${user_id}`);
  return response.data;
};

export const getOrderDetail = async (order_id) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find((o) => o.id === order_id);
    const shop = dummyStore.shops.find((s) => s.id === order?.shop_id);
    const items = dummyStore.orderItems
      .filter((oi) => oi.order_id === order_id)
      .map((oi) => {
        const product = dummyStore.products.find((p) => p.id === oi.product_id);
        return {
          id: oi.id,
          product_id: oi.product_id,
          name: product?.name,
          label: product?.label,
          quantity: oi.quantity,
          price: oi.price,
          image: product?.image,
        };
      });

    return {
      success: true,
      data: {
        id: order?.id,
        shop_id: order?.shop_id,
        shop_name: shop?.shop_name,
        shop_telephone: shop?.shop_telephone,
        recipient: order?.recipient,
        telephone: order?.telephone,
        address: order?.address,
        note: order?.note,
        created_at: order?.created_at,
        status_shipping: order?.status_shipping,
        cancelBy: order?.cancelBy,
        total_price: order?.total_price,
        orderItems: items,
      },
    };
  }

  const response = await api.get(`/orders/${order_id}`);
  return response.data;
};

export const cancelOrder = async (order_id, userRole) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find((o) => o.id === order_id);
    if (order) {
      order.status_shipping = "cancelPending";
      order.cancelBy = userRole;
      return { success: true, message: "Cancel request submitted" };
    }
    throw new Error("Order tidak ditemukan");
  }

  const response = await api.put(`/orders/${order_id}/cancel`, { userRole });
  return response.data;
};

export const rejectCancel = async (order_id) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find((o) => o.id === order_id);
    if (order) {
      order.status_shipping = "prepared";
      order.cancelBy = null;
      return { success: true, message: "Cancel request rejected" };
    }
    throw new Error("Order tidak ditemukan");
  }

  const response = await api.put(`/orders/${order_id}/reject-cancel`);
  return response.data;
};

export const acceptCancel = async (order_id) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find((o) => o.id === order_id);
    if (order) {
      order.status_shipping = "cancelled";
      order.deleted_at = new Date().toISOString();
      return { success: true, message: "Order cancelled" };
    }
    throw new Error("Order tidak ditemukan");
  }

  const response = await api.put(`/orders/${order_id}/accept-cancel`);
  return response.data;
};

// ==================== SHOP ENDPOINTS ====================
export const createShop = async (shopData) => {
  if (USE_DUMMY) {
    await delay();
    const newShop = {
      id: dummyStore.shops.length + 1,
      user_id: shopData.user_id,
      shop_name: shopData.shop_name,
      shop_telephone: shopData.shop_telephone,
      shop_address: shopData.shop_address,
      account_number: shopData.account_number,
      qris_picture: shopData.qris_picture,
      created_at: new Date().toISOString(),
      status_admin: "pending",
    };
    dummyStore.shops.push(newShop);
    return {
      success: true,
      message: "Shop registration submitted",
      data: newShop,
    };
  }

  const response = await api.post("/shops", shopData);
  return response.data;
};

export const getDetailShop = async (shop_id) => {
  if (USE_DUMMY) {
    await delay();
    const shop = dummyStore.shops.find((s) => s.id === shop_id);
    const user = dummyStore.users.find((u) => u.id === shop?.user_id);
    return {
      success: true,
      data: {
        ...shop,
        username: user?.username,
        email: user?.email,
      },
    };
  }

  const response = await api.get(`/shops/${shop_id}`);
  return response.data;
};

export const editShop = async (shop_id, shopData) => {
  if (USE_DUMMY) {
    await delay();
    const index = dummyStore.shops.findIndex((s) => s.id === shop_id);
    if (index !== -1) {
      dummyStore.shops[index] = { ...dummyStore.shops[index], ...shopData };
      return {
        success: true,
        message: "Shop updated",
        data: dummyStore.shops[index],
      };
    }
    throw new Error("Shop tidak ditemukan");
  }

  const response = await api.put(`/shops/${shop_id}`, shopData);
  return response.data;
};

// ==================== SALES ENDPOINTS (SELLER) ====================
export const getAllSales = async (shop_id) => {
  if (USE_DUMMY) {
    await delay();
    const shopOrders = dummyStore.orders
      .filter((o) => o.shop_id === shop_id)
      .map((o) => {
        const itemCount = dummyStore.orderItems.filter(
          (oi) => oi.order_id === o.id
        ).length;
        return {
          id: o.id,
          shop_id: o.shop_id,
          recipient: o.recipient,
          telephone: o.telephone,
          created_at: o.created_at,
          total_price: o.total_price,
          status_shipping: o.status_shipping,
          productCount: itemCount,
        };
      });
    return { success: true, data: shopOrders };
  }

  const response = await api.get(`/sales/shop/${shop_id}`);
  return response.data;
};

export const acceptPayment = async (order_id, status) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find((o) => o.id === order_id);
    if (order) {
      if (status) {
        order.status_shipping = "prepared";
      } else {
        order.status_shipping = "cancelled";
        order.cancelBy = "seller";
      }
      return {
        success: true,
        message: status ? "Payment accepted" : "Payment rejected",
      };
    }
    throw new Error("Order tidak ditemukan");
  }

  const response = await api.put(`/sales/${order_id}/payment`, { status });
  return response.data;
};

export const changeStatusShipping = async (order_id, status_shipping) => {
  if (USE_DUMMY) {
    await delay();
    const order = dummyStore.orders.find((o) => o.id === order_id);
    if (order) {
      order.status_shipping = status_shipping;
      return { success: true, message: "Status updated" };
    }
    throw new Error("Order tidak ditemukan");
  }

  const response = await api.put(`/sales/${order_id}/status`, {
    status_shipping,
  });
  return response.data;
};

// ==================== ADMIN ENDPOINTS ====================
export const getAllShop = async () => {
  if (USE_DUMMY) {
    await delay();
    const accepted = dummyStore.shops.filter(
      (s) => s.status_admin === "accept"
    );
    return { success: true, data: accepted };
  }

  const response = await api.get("/admin/shops");
  return response.data;
};

export const getRequestShop = async () => {
  if (USE_DUMMY) {
    await delay();
    const pending = dummyStore.shops.filter(
      (s) => s.status_admin === "pending"
    );
    return { success: true, data: pending };
  }

  const response = await api.get("/admin/shops/requests");
  return response.data;
};

export const acceptRequestShop = async (shop_id, status) => {
  if (USE_DUMMY) {
    await delay();
    const index = dummyStore.shops.findIndex((s) => s.id === shop_id);
    if (index !== -1) {
      if (status) {
        dummyStore.shops[index].status_admin = "accept";
        return { success: true, message: "Shop approved" };
      } else {
        dummyStore.shops.splice(index, 1);
        return { success: true, message: "Shop rejected" };
      }
    }
    throw new Error("Shop tidak ditemukan");
  }

  const response = await api.put(`/admin/shops/${shop_id}/approve`, { status });
  return response.data;
};

export const getAllUser = async () => {
  if (USE_DUMMY) {
    await delay();
    return { success: true, data: dummyStore.users };
  }

  const response = await api.get("/admin/users");
  return response.data;
};

// ==================== UTILITY ====================
// Set authorization token (panggil setelah login)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Export axios instance untuk custom requests
export { api };

// Export dummy store untuk debugging (opsional)
export const getDummyStore = () => dummyStore;
