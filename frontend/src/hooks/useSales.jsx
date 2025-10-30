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
  const [selectedSale, setSelectedSale] = useState(null);

  // Fetch Semua Sales (Pesanan yang masuk ke toko)
  const fetchSales = async (shopId) => {
    setLoading(true);
    try {
      const response = await getAllSales(shopId);
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
  const handlePayment = async (orderId, isAccepted, shopId) => {
    try {
      const response = await acceptPayment(orderId, isAccepted);
      if (response.success) {
        await fetchSales(shopId); // Refresh data setelah perubahan
      }
      return response;
    } catch (error) {
      console.error("Error handling payment:", error);
      return { success: false, message: "Gagal memproses pembayaran" };
    }
  };

  // Ubah Status Pengiriman
  const updateShippingStatus = async (orderId, statusShipping, shopId) => {
    try {
      const response = await changeStatusShipping(orderId, statusShipping);
      if (response.success) {
        await fetchSales(shopId);
      }
      return response;
    } catch (error) {
      console.error("Error updating shipping status:", error);
      return { success: false, message: "Gagal mengubah status pengiriman" };
    }
  };

  // Pilih / Reset Detail Sale
  const selectSale = (sale) => setSelectedSale(sale);
  const resetSelectedSale = () => setSelectedSale(null);

  // Return Semua yang Diperlukan
  return {
    sales,
    loading,
    selectedSale,
    fetchSales,
    handlePayment,
    updateShippingStatus,
    selectSale,
    resetSelectedSale,
  };
};
