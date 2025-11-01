import { useState, useEffect } from "react";
import { createShop, getDetailShop, editShop } from "@/service/dummyApi";
import { toast } from "react-toastify";

export const useShop = () => {
  const [shop, setShop] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Detail Shop
  const fetchDetailShop = async (shop_id) => {
    setLoading(true);
    try {
      const response = await getDetailShop(shop_id);
      if (response.success && response.data.id) {
        setShop(response.data);
      } else {
        setShop(null);
      }
    } catch (error) {
      console.error("Error fetching shop detail:", error);
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  // Buat Shop
  const createNewShop = async (shopData) => {
    setLoading(true);
    try {
      const response = await createShop(shopData);
      if (response.success) {
        toast.success("Shop created successfully!");
        setShop(response.data);
        console.log(response);
      } else {
        toast.error("Failed to create shop. Please try again.");
      }
    } catch (error) {
      console.error("Error creating shop:", error);
      toast.error("Failed to create shop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update Shop
  const updateShop = async (shop_id, shopData) => {
    setLoading(true);
    try {
      const response = await editShop(shop_id, shopData);
      if (response.success) {
        toast.success("Shop updated successfully!");
        setShop(response.data);
        console.log(response);
      } else {
        toast.error("Failed to update shop. Please try again.");
      }
    } catch (error) {
      console.error("Error updating shop:", error);
      toast.error("Failed to update shop. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { shop, loading, fetchDetailShop, createNewShop, updateShop };
};
