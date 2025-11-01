import { useState } from "react";
import {
  createOrder,
  getAllOrder,
  getAllOrderHistory,
  getOrderDetail,
  cancelOrder,
  rejectCancel,
  acceptCancel,
} from "@/service/dummyApi";
import { useProducts } from "./useProducts";
import { useAuth } from "./useAuth";

export const useOrders = () => {
  const { user } = useAuth();
  const { removeFromCart: removeFromCartHook } = useProducts();

  // State Utama
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Semua Order Aktif
  const fetchOrders = async (userId) => {
    setLoading(true);
    try {
      const response = await getAllOrder(userId);
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Riwayat Order
  const fetchOrderHistory = async (userId) => {
    setLoading(true);
    try {
      const response = await getAllOrderHistory(userId);
      if (response.success) {
        setOrderHistory(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrderHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Detail Order
  const fetchOrderDetail = async (orderId) => {
    setLoading(true);
    try {
      const response = await getOrderDetail(orderId);
      if (response.success) {
        setOrderDetail(response.data || null);
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
      setOrderDetail(null);
    } finally {
      setLoading(false);
    }
  };

  // Buat Order Baru
  const makeOrder = async (orderData) => {
    try {
      const response = await createOrder(orderData);
      if (response.success) {
        // Hapus cart items menggunakan userId dari user context
        if (user?.id) {
          for (const item of orderData.orderItems) {
            await removeFromCartHook(user.id, item.id);
          }
        }
        await fetchOrders(orderData.userId);
        return { success: true, message: response.message };
      }
      return { success: false, message: "Gagal membuat order" };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, message: "Terjadi kesalahan" };
    }
  };

  // Ajukan Pembatalan Order
  const requestCancel = async (orderId, userRole, userId) => {
    console.log(orderId, userRole, userId);
    try {
      const response = await cancelOrder(orderId, userRole);
      if (response.success) {
        await fetchOrders(userId);
        console.log(response);
      }
      return response;
    } catch (error) {
      console.error("Error cancelling order:", error);
      return { success: false, message: "Gagal membatalkan order" };
    }
  };

  // Terima Pembatalan
  const approveCancel = async (orderId, userId) => {
    try {
      const response = await acceptCancel(orderId);
      if (response.success) {
        await fetchOrders(userId);
        await fetchOrderHistory(userId);
      }
      return response;
    } catch (error) {
      console.error("Error approving cancel:", error);
      return { success: false, message: "Gagal menyetujui pembatalan" };
    }
  };

  // Tolak Pembatalan
  const denyCancel = async (orderId, userId) => {
    try {
      const response = await rejectCancel(orderId);
      if (response.success) {
        await fetchOrders(userId);
      }
      return response;
    } catch (error) {
      console.error("Error rejecting cancel:", error);
      return { success: false, message: "Gagal menolak pembatalan" };
    }
  };

  // Reset Detail
  const resetOrderDetail = () => setOrderDetail(null);

  // Return Hook
  return {
    orders,
    orderHistory,
    orderDetail,
    loading,
    fetchOrders,
    fetchOrderHistory,
    fetchOrderDetail,
    makeOrder,
    requestCancel,
    approveCancel,
    denyCancel,
    resetOrderDetail,
  };
};
