import { useState, useEffect } from "react";
import {
  getAllCart,
  addToCart as addToCartApi,
  updateCartQuantity,
  deleteCartItem,
} from "@/service/dummyApi";

import {
  getAllProductsApi,
  searchProductApi,
  getProductByCategoryApi,
  getDetailProductApi,
  addProductApi,
  editProductApi,
  deleteProductApi,
} from "@/service/api";

// Daftar kategori yang tersedia
export const allCategories = ["Fashion", "Others"];
export const fashionCategory = ["Fashion"];
export const othersCategory = ["Others"];

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [total_price, setTotalPrice] = useState(0);

  // Fetch products saat component mount atau kategori berubah
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // Hitung total price saat cart berubah
  useEffect(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cart]);

  // ==================== PRODUCT ====================
  const fetchProducts = async () => {
    setLoading(true);
    setProducts([]);
    try {
      let response;

      if (selectedCategory === "all") {
        response = await getAllProductsApi();
      } else {
        response = await getProductByCategoryApi(selectedCategory);
      }

      if (response.status === 200) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    if (!query.trim()) {
      fetchProducts();
      return;
    }

    setLoading(true);
    try {
      const response = await searchProductApi(query);
      if (response.status === 200) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductDetail = async (id) => {
    setLoading(true);
    try {
      const response = await getDetailProductApi(Number(id));
      if (response.status === 200) {
        setProductDetail(response.data.data || null);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
      setProductDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const addNewProduct = async (productData) => {
    try {
      const response = await addProductApi(productData);
      console.log(response);
      if (response.status === 201) {
        await fetchProducts();
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return { success: false, message: "Failed to add product" };
    }
  };

  const editExistingProduct = async (product_id, updatedData) => {
    try {
      const response = await editProductApi(product_id, updatedData);
      console.log(response);
      if (response.status === 200) {
        await fetchProducts();
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error("Error editing product:", error);
      return { success: false, message: "Failed to edit product" };
    }
  };

  const removeProduct = async (product_id) => {
    try {
      const response = await deleteProductApi(product_id);
      console.log(response);
      if (response.status === 200) {
        await fetchProducts();
        return { success: true, message: response.message };
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      return { success: false, message: "Failed to delete product" };
    }
  };

  // ==================== CART ====================
  const loadCart = async (user_id) => {
    try {
      const response = await getAllCart(user_id);
      if (response.success) {
        setCart(response.data || []);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    }
  };

  const addToCart = async (user_id, product) => {
    try {
      const response = await addToCartApi(user_id, product.id);
      if (response.success) {
        await loadCart(user_id);
        return true;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const updateQuantity = async (user_id, cartId, quantity) => {
    try {
      if (quantity < 1) {
        await removeFromCart(user_id, cartId);
        return;
      }

      const response = await updateCartQuantity(cartId, quantity);
      if (response.success) {
        await loadCart(user_id);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const increaseQuantity = async (user_id, cartItem) => {
    await updateQuantity(user_id, cartItem.id, cartItem.quantity + 1);
  };

  const decreaseQuantity = async (user_id, cartItem) => {
    await updateQuantity(user_id, cartItem.id, cartItem.quantity - 1);
  };

  const removeFromCart = async (user_id, cartId) => {
    try {
      const response = await deleteCartItem(cartId);
      if (response.success) {
        await loadCart(user_id);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const changeCategory = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  return {
    products,
    productDetail,
    getProductDetail,
    cart,
    total_price,
    loading,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    allCategories,
    fashionCategory,
    othersCategory,
    changeCategory,
    searchProducts,
    loadCart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    addNewProduct,
    editExistingProduct,
    removeProduct,
  };
};
