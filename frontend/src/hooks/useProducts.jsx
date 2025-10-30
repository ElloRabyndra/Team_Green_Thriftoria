import { useState, useEffect } from "react";
import { 
  getAllProduct, 
  getProductByCategory, 
  searchProduct,
  getAllCart,
  addToCart as addToCartApi,
  updateCartQuantity,
  deleteCartItem
} from "@/service/dummyApi";

// Daftar kategori yang tersedia
export const allCategories = ["Fashion", "Others"];
export const fashionCategory = ["Fashion"];
export const othersCategory = ["Others"];

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch products saat component mount atau kategori berubah
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // Hitung total price saat cart berubah
  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotalPrice(total);
  }, [cart]);

  // Function untuk fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      
      if (selectedCategory === "All") {
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

  // Function untuk search products
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

  // Function untuk load cart berdasarkan userId
  const loadCart = async (userId) => {
    try {
      const response = await getAllCart(userId);
      if (response.success) {
        setCart(response.data || []);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    }
  };

  // Function untuk menambahkan produk ke cart
  const addToCart = async (userId, product) => {
    try {
      const response = await addToCartApi(userId, product.id);
      if (response.success) {
        // Reload cart setelah berhasil menambahkan
        await loadCart(userId);
        return true;
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  // Function untuk update quantity di cart
  const updateQuantity = async (userId, cartId, quantity) => {
    try {
      if (quantity < 1) {
        // Jika quantity < 1, hapus item
        await removeFromCart(userId, cartId);
        return;
      }

      const response = await updateCartQuantity(cartId, quantity);
      if (response.success) {
        await loadCart(userId);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Function untuk increase quantity
  const increaseQuantity = async (userId, cartItem) => {
    await updateQuantity(userId, cartItem.id, cartItem.quantity + 1);
  };

  // Function untuk decrease quantity
  const decreaseQuantity = async (userId, cartItem) => {
    await updateQuantity(userId, cartItem.id, cartItem.quantity - 1);
  };

  // Function untuk menghapus produk dari cart
  const removeFromCart = async (userId, cartId) => {
    try {
      const response = await deleteCartItem(cartId);
      if (response.success) {
        await loadCart(userId);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  // Function untuk mengubah kategori
  const changeCategory = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  return {
    products,
    cart,
    totalPrice,
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
  };
};