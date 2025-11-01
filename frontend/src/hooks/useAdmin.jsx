import { useState, useEffect } from "react";
import {
  getAllShop,
  getRequestShop,
  acceptRequestShop,
  getAllUser,
} from "@/service/dummyApi";
import { deleteUserApi } from "@/service/api";
import { toast } from "react-toastify";

export const useAdmin = () => {
  const [userList, setUserList] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [requestShopList, setRequestShopList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch User List
  const fetchUserList = async () => {
    setLoading(true);
    try {
      const response = await getAllUser();
      if (response.success) {
        setUserList(response.data);
      } else {
        setUserList(null);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      setUserList(null);
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const deleteUser = async (user_id) => {
    try {
      const response = await deleteUserApi(user_id);

      if (response.status === 200) {
        return { success: true, message: response.data.message };
      } else {
        return {
          success: false,
          message: "Failed to delete user. Please try again.",
        };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete user. Please try again.";
      return { success: false, message: errorMessage };
    }
  };

  // Fetch Shop List
  const fetchShopList = async () => {
    setLoading(true);
    try {
      const response = await getAllShop();
      if (response.success) {
        setShopList(response.data);
      } else {
        setShopList(null);
      }
    } catch (error) {
      console.error("Error fetching shop list:", error);
      setShopList(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Request Shop List
  const fetchRequestShopList = async () => {
    setLoading(true);
    try {
      const response = await getRequestShop();
      if (response.success) {
        setRequestShopList(response.data);
      } else {
        setRequestShopList(null);
      }
    } catch (error) {
      console.error("Error fetching request shop list:", error);
      setRequestShopList(null);
    } finally {
      setLoading(false);
    }
  };

  // Accept Request Shop
  const acceptRequest = async (shop_id, status) => {
    setLoading(true);
    try {
      const response = await acceptRequestShop(shop_id, status);
      if (response.success) {
        const message = status ? "Shop approved" : "Shop rejected";
        toast.success(message);
        fetchShopList();
        fetchRequestShopList();
      } else {
        toast.error("Failed to accept request. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    userList,
    shopList,
    requestShopList,
    fetchUserList,
    fetchShopList,
    fetchRequestShopList,
    deleteUser,
    acceptRequest,
    loading,
  };
};
