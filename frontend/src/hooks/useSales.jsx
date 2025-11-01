import { useState, useEffect } from "react";
import {
  getAllSales,
  acceptPayment,
  changeStatusShipping,
} from "@/service/dummyApi";

export const useSales = () => {
  // State Utama
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Semua Sales (Pesanan yang masuk ke toko)
  const fetchSales = async (shop_id) => {
    setLoading(true);
    try {
      const response = await getAllSales(shop_id);
      if (response.success) {
        setSales(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Terima / Tolak Pembayaran
  const handlePayment = async (order_id, isAccepted, user_id) => {
    try {
      const response = await acceptPayment(order_id, isAccepted);
      if (response.success) {
        await fetchOrders(user_id);
      }
      return response;
    } catch (error) {
      console.error("Error handling payment:", error);
      return { success: false, message: "Gagal memproses pembayaran" };
    }
  };

  // Ubah Status Pengiriman
  const updateShippingStatus = async (order_id, status_shipping, user_id) => {
    try {
      const response = await changeStatusShipping(order_id, status_shipping);
      if (response.success) {
        await fetchOrders(user_id);
      }
      return response;
    } catch (error) {
      console.error("Error updating shipping status:", error);
      return { success: false, message: "Gagal mengubah status pengiriman" };
    }
  };

  // Return Semua yang Diperlukan
  return {
    sales,
    loading,
    fetchSales,
    handlePayment,
    updateShippingStatus,
  };
};
