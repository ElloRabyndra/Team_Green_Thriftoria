import { useState, useEffect } from "react";
import {
  getAllProduct,
  getProductByCategory,
  searchProduct,
  getAllCart,
  addToCart as addToCartApi,
  updateCartQuantity,
  deleteCartItem,
  addProduct,
  editProduct,
  deleteProduct,
  getDetailProduct,
} from "@/service/dummyApi";

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
    try {
      let response;

      if (selectedCategory === "all") {
        response = await getAllProduct();
      } else {
        response = await getProductByCategory(selectedCategory);
      }

      if (response.success) {
        setProducts(response.data || []);
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
      const response = await searchProduct(query);
      if (response.success) {
        setProducts(response.data || []);
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
      const response = await getDetailProduct(Number(id));
      if (response.success) {
        setProductDetail(response.data || null);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
      setProductDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const addNewProduct = async ({
    shop_id,
    name,
    category,
    label,
    description,
    image,
    price,
    stock,
  }) => {
    try {
      const response = await addProduct(
        shop_id,
        name,
        category,
        label,
        description,
        "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
        price,
        stock
      );

      if (response.success) {
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
      const productData = {
        ...updatedData,
        image: "https://www.svgrepo.com/show/508699/landscape-placeholder.svg", // abaikan file image asli
      };

      const response = await editProduct(product_id, productData);

      if (response.success) {
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
      const response = await deleteProduct(product_id);
      if (response.success) {
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
