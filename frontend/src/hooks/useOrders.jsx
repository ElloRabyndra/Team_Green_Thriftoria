import { useState } from "react";
import {
  createOrderApi,
  getAllActiveOrdersApi,
  getOrderHistoryApi,
  getOrderDetailApi,
  requestOrderCancellationApi,
  rejectOrderCancellationApi,
  acceptOrderCancellationApi,
  getAllSalesApi,
  acceptRejectPaymentApi,
  updateShippingStatusApi,
} from "@/service/api";
import { useProducts } from "./useProducts";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";

export const useOrders = () => {
  const { user } = useAuth();
  const { loadCart } = useProducts();

  // State Utama
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [sales, setSales] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderActionLoading, setOrderActionLoading] = useState(false);

  // Fetch Semua Order Aktif (Buyer)
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllActiveOrdersApi();
      console.log("Response from getAllActiveOrdersApi:", response);

      if (response.status === 200) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching active orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Riwayat Order (Buyer)
  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const response = await getOrderHistoryApi();
      console.log("Response from getOrderHistoryApi:", response);

      if (response.status === 200 && response.data.status === "success") {
        setOrderHistory(response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrderHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Semua Penjualan (Sales) untuk Seller
  const fetchAllSales = async (shop_id) => {
    setLoading(true);
    try {
      const response = await getAllSalesApi(shop_id);
      console.log("Response from getAllSalesApi:", response);

      if (response.status === 200 && response.data.status === "success") {
        setSales(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Detail Order (Buyer/Seller)
  const fetchOrderDetail = async (order_id) => {
    setLoading(true);
    try {
      const response = await getOrderDetailApi(order_id);
      console.log("Response from getOrderDetailApi:", response);

      if (response.status === 200 && response.data.order) {
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

  // Buat Order Baru (Buyer - Checkout)
  const makeOrder = async (orderData) => {
    setLoading(true);
    console.log("Submitted Data:", orderData);
    try {
      const response = await createOrderApi(orderData);
      console.log("Response from createOrderApi:", response);

      if (response.status === 201) {
        loadCart();

        await fetchOrders();

        return {
          success: true,
          message: response.data.message,
          order_id: response.data.order_id,
        };
      }
      return { success: false, message: "Failed to create order" };
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data?.error || error.message
      );
      return {
        success: false,
        message:
          error.response?.data?.error || "Failed to create order",
      };
    } finally {
      setLoading(false);
    }
  };

  // ==================== Action Order Buyer/Seller ====================

  // Ajukan Pembatalan Order
  const requestCancel = async (order_id, cancelRole) => {
    setOrderActionLoading(true);
    try {
      const response = await requestOrderCancellationApi(order_id, cancelRole);
      console.log("Response from requestOrderCancellationApi:", response);

      if (response.status === 200) {
        toast.success(response.data.message || "Cancel request submitted!");
        await fetchOrders();
        await fetchOrderDetail(order_id);
      }
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Error cancelling order:", error);
      return { success: false, message: "Gagal mengajukan pembatalan" };
    } finally {
      setOrderActionLoading(false);
    }
  };

  // Terima Pembatalan (Seller action)
  const approveCancel = async (order_id) => {
    setOrderActionLoading(true);
    try {
      const response = await acceptOrderCancellationApi(order_id);
      console.log("Response from acceptOrderCancellationApi:", response);

      if (response.status === 200) {
        toast.success(response.data.message || "Order cancelled successfully.");
        await fetchOrders();
        await fetchOrderHistory();
        await fetchOrderDetail(order_id);
      }
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Error approving cancel:", error);
      return { success: false, message: "Gagal menyetujui pembatalan" };
    } finally {
      setOrderActionLoading(false);
    }
  };

  // Tolak Pembatalan (Seller action)
  const denyCancel = async (order_id) => {
    setOrderActionLoading(true);
    try {
      const response = await rejectOrderCancellationApi(order_id);
      console.log("Response from rejectOrderCancellationApi:", response);

      if (response.status === 200) {
        toast.success(response.data.message || "Cancellation rejected.");
        await fetchOrders();
        await fetchOrderDetail(order_id);
      }
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Error rejecting cancel:", error);
      return { success: false, message: "Gagal menolak pembatalan" };
    } finally {
      setOrderActionLoading(false);
    }
  };

  // ==================== Seller Specific Actions ====================

  // Accept/Reject Payment (Seller)
  const updatePaymentStatus = async (order_id, status) => {
    setOrderActionLoading(true);
    try {
      const response = await acceptRejectPaymentApi(order_id, status);
      console.log("Response from acceptRejectPaymentApi:", response);

      if (response.status === 200) {
        toast.success(response.data.message || "Payment status updated.");
        await fetchAllSales(user.Shop?.id);
        await fetchOrderDetail(order_id);
      }
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Error updating payment status:", error);
      return { success: false, message: "Gagal memperbarui status pembayaran" };
    } finally {
      setOrderActionLoading(false);
    }
  };

  // Update Shipping Status (Seller)
  const updateShippingStatus = async (order_id, status_shipping) => {
    setOrderActionLoading(true);
    try {
      const response = await updateShippingStatusApi(order_id, status_shipping);
      console.log("Response from updateShippingStatusApi:", response);

      if (response.status === 200) {
        toast.success(response.data.message || "Shipping status updated.");
        await fetchAllSales(user.Shop?.id);
        await fetchOrderDetail(order_id);
      }
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Error updating shipping status:", error);
      return { success: false, message: "Gagal memperbarui status pengiriman" };
    } finally {
      setOrderActionLoading(false);
    }
  };

  // Reset Detail
  const resetOrderDetail = () => setOrderDetail(null);

  // Return Hook
  return {
    orders,
    orderHistory,
    sales,
    orderDetail,
    loading,
    orderActionLoading,
    fetchOrders,
    fetchOrderHistory,
    fetchAllSales,
    fetchOrderDetail,
    makeOrder,
    requestCancel,
    approveCancel,
    denyCancel,
    updatePaymentStatus,
    updateShippingStatus,
    resetOrderDetail,
  };
};
