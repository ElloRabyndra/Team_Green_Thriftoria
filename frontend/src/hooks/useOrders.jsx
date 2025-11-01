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
import { toast } from "react-toastify";

export const useOrders = () => {
  const { user } = useAuth();
  const { removeFromCart: removeFromCartHook } = useProducts();

  // State Utama
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Semua Order Aktif
  const fetchOrders = async (user_id) => {
    setLoading(true);
    try {
      const response = await getAllOrder(user_id);
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
  const fetchOrderHistory = async (user_id) => {
    setLoading(true);
    try {
      const response = await getAllOrderHistory(user_id);
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
  const fetchOrderDetail = async (order_id) => {
    setLoading(true);
    try {
      const response = await getOrderDetail(order_id);
      if (response.success && response.data.id) {
        setOrderDetail(response.data);
      } else {
        setOrderDetail(null);
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
        // Hapus cart items menggunakan user_id dari user context
        if (user?.id) {
          for (const item of orderData.orderItems) {
            await removeFromCartHook(user.id, item.id);
          }
        }
        await fetchOrders(orderData.user_id);
        return { success: true, message: response.message };
      }
      return { success: false, message: "Gagal membuat order" };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, message: "Terjadi kesalahan" };
    }
  };

  // Ajukan Pembatalan Order
  const requestCancel = async (order_id, userRole, user_id) => {
    try {
      const response = await cancelOrder(order_id, userRole);
      if (response.success) {
        await fetchOrders(user_id);
        toast.success("Cancel request submitted!");
        console.log(response);
      }
      return response;
    } catch (error) {
      console.error("Error cancelling order:", error);
      return { success: false, message: "Gagal membatalkan order" };
    }
  };

  // Terima Pembatalan
  const approveCancel = async (order_id, user_id) => {
    try {
      const response = await acceptCancel(order_id);
      if (response.success) {
        await fetchOrders(user_id);
        await fetchOrderHistory(user_id);
      }
      return response;
    } catch (error) {
      console.error("Error approving cancel:", error);
      return { success: false, message: "Gagal menyetujui pembatalan" };
    }
  };

  // Tolak Pembatalan
  const denyCancel = async (order_id, user_id) => {
    try {
      const response = await rejectCancel(order_id);
      if (response.success) {
        await fetchOrders(user_id);
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
