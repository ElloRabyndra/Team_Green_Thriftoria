import { useState, useEffect, useCallback } from "react";
import {
  getAllCartApi,
  addToCartApi,
  updateCartQuantityApi,
  deleteCartItemApi,
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
  const [cartLoading, setCartLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [total_price, setTotalPrice] = useState(0);

  // Hitung total price saat cart berubah
  useEffect(() => {
    let total = 0;
    cart.forEach((shopCart) => {
      shopCart.cart_items.forEach((item) => {
        total += item.price * item.quantity;
      });
    });
    setTotalPrice(total);
  }, [cart]);

  // ==================== PRODUCT ====================
  const fetchProducts = useCallback(async () => {
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
  }, [selectedCategory]);

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
  const loadCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const response = await getAllCartApi();

      if (response.status === 200 && response.data.status === "success") {
        setCart(response.data.data || []);
      } else {
        console.error(
          "Failed to load cart with message:",
          response.data.message
        );
        setCart([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (productId) => {
      try {
        const response = await addToCartApi(productId);

        if (response.status === 200 || response.status === 201) {
          await loadCart();
          return { success: true, message: response.data.message };
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        const errorMessage =
          error.response?.data?.error || "Failed to add product to cart";
        return { success: false, message: errorMessage };
      }
    },
    [loadCart]
  );

  const removeFromCart = useCallback(
    async (cartId) => {
      try {
        const response = await deleteCartItemApi(cartId);

        if (response.status === 200) {
          await loadCart();
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    },
    [loadCart]
  );

  const updateQuantity = useCallback(
    async (cartId, quantity) => {
      try {
        if (quantity < 1) {
          await removeFromCart(cartId);
          return;
        }

        const response = await updateCartQuantityApi(cartId, quantity);

        if (response.status === 200) {
          await loadCart();
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    },
    [loadCart, removeFromCart]
  );

  const increaseQuantity = async (cartItem) => {
    await updateQuantity(cartItem.id, cartItem.quantity + 1);
  };

  const decreaseQuantity = async (cartItem) => {
    await updateQuantity(cartItem.id, cartItem.quantity - 1);
  };

  const changeCategory = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  // Fetch products saat component mount atau kategori berubah
  useEffect(() => {
    fetchProducts();
    loadCart();
  }, [selectedCategory, fetchProducts, loadCart]);

  return {
    products,
    productDetail,
    getProductDetail,
    cart,
    total_price,
    loading,
    cartLoading,
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
