import { useState, useEffect } from "react";
import { createShop, getDetailShop, editShop } from "@/service/dummyApi";
import { getShopDetailApi, createShopApi, editShopApi } from "@/service/api";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

export const useShop = () => {
  const [shop, setShop] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loadUser } = useAuth();
  // Fetch Detail Shop
  const fetchDetailShop = async (shop_id) => {
    setLoading(true);
    try {
      const response = await getShopDetailApi(shop_id);
      if (response.status === 200) {
        setShop(response.data.data);
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
      const response = await createShopApi(shopData);
      if (response.status == 201) {
        toast.success("Shop created successfully!");
        setShop(response.data);
        loadUser();
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
      const response = await editShopApi(shop_id, shopData);
      if (response.status == 200) {
        toast.success("Shop updated successfully!");
        setShop(response.data.data);
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
