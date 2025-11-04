import { useState, useEffect } from "react";
import {
  getAllShop,
  getRequestShop,
  acceptRequestShop,
  getAllUser,
} from "@/service/dummyApi";
import {
  getAllUserApi,
  getUserByIdApi,
  getAllShopApproveApi,
  getAllShopPendingApi,
  reviewShopRequestApi,
} from "@/service/api";
import { toast } from "react-toastify";

export const useAdmin = () => {
  const [userList, setUserList] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const [shopList, setShopList] = useState([]);
  const [requestShopList, setRequestShopList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch User List
  const fetchUserList = async () => {
    setLoading(true);
    try {
      const response = await getAllUserApi();
      if (response.status === 200) {
        setUserList(response.data.data);
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

  // Fetch User Detail
  const fetchUserDetail = async (user_id) => {
    setLoading(true);
    try {
      const response = await getUserByIdApi(user_id);
      if (response.status === 200) {
        setUserDetail(response.data.data);
      } else {
        setUserDetail(null);
      }
    } catch (error) {
      console.error("Error fetching user detail:", error);
      setUserDetail(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Shop List
  const fetchShopList = async () => {
    setLoading(true);
    try {
      const response = await getAllShopApproveApi();
      if (response.status === 200) {
        setShopList(response.data.data);
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
      const response = await getAllShopPendingApi();
      if (response.status === 200) {
        setRequestShopList(response.data.data);
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
      const response = await reviewShopRequestApi(shop_id, status);
      if (response.status === 200) {
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
    userDetail,
    shopList,
    requestShopList,
    fetchUserList,
    fetchUserDetail,
    fetchShopList,
    fetchRequestShopList,
    acceptRequest,
    loading,
  };
};
