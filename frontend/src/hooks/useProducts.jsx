import { useState, useEffect } from "react";
import { getProducts, getSearchProducts } from "@/service/oldApi";

// Daftar kategori thrift yang akan ditampilkan
export const thriftCategories = [
  "mens-shirts",
  "mens-shoes", 
  "tops",
  "womens-bags",
  "womens-dresses",
  "womens-shoes",
  "smartphones",
  "tablets",
  "mobile-accessories"
];

export const shirtsCategories = [
  "mens-shirts",
  "womens-dresses",
  "tops"
];

export const shoesCategories = [
  "mens-shoes",
  "womens-shoes"
];

export const gadgetsCategories = [
  "smartphones",
  "tablets",
  "laptops",
  "mobile-accessories"
];

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(thriftCategories);
  const [cart, setCart] = useState([]);
  const [hasInitializedCart, setHasInitializedCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // fetch data ketika selectedCategory berubah
  useEffect(() => {
    categories.length > 0 && fetchAllProducts(categories);
  }, [categories]);

  // Load cart dari localStorage saat aplikasi dibuka
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
    setHasInitializedCart(true);
  }, []);

  // Simpan cart ke localStorage dan hitung total harga saat cart berubah
  useEffect(() => {
    if(!hasInitializedCart) return;
    localStorage.setItem("cart", JSON.stringify(cart));
    cart.length > 0 && setTotalPrice(cart.reduce((acc, item) => acc + item.price * item.quantity, 0));
  }, [cart, hasInitializedCart]);

  // Function untuk mengambil semua produk 
  const fetchAllProducts = async (categories) => {
    setLoading(true);

    try {
      const data = await getProducts();
      
      // Filter hanya produk dari kategori thrift
      const thriftProducts = data.products.filter(product => 
        categories.includes(product.category)
      );
      
      setProducts(thriftProducts || []);
    } catch (error) {
      console.error("Error fetching all products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Function untuk pencarian produk
  const fetchSearchProducts = async (query) => {
    setLoading(true);

    try {
      const data = await getSearchProducts(query);
      setProducts(data.products || []);
    } catch(error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  }

  // Function untuk mengubah kategori yang dipilih (hanya mengubah state)
  const changeCategories = (categories) => {
    setCategories(categories);
    setSearchQuery("");
  };

  // Function pencarian produk
  const searchProducts = (query) => {
    setCategories([]);
    fetchSearchProducts(query);
  }

  // Function untuk menambahkan produk ke cart
  const addToCart = (product) => {
    if(cart.find(item => item.id === product.id)) {
      setCart(cart.map(item => item.id === product.id ? 
        {...item, quantity: item.quantity + 1} : item));
    } else {
      // dummy shop name (sementara)
      const shopName = product.id % 2 === 0 ? "Shop 1" : "Shop 2";
      setCart([...cart, {id: product.id, title: product.title, shopName, category: product.category, thumbnail: product.thumbnail, price: product.price, quantity: 1}]);
    }
  }

  // Function untuk mengurangi quantity
  const decreaseQuantity = (product) => {
    const currentItem = cart.find(item => item.id === product.id);
    if(currentItem && currentItem.quantity > 1) {
      setCart(prevCart => prevCart.map(item => item.id === product.id ? 
        {...item, quantity: item.quantity - 1} : item));
    }  else {
      setCart(prevCart => prevCart.filter(item => item.id !== product.id));
    }
  }

  // Function untuk menghapus produk dari cart
  const removeFromCart = (product) => {
    setCart(cart => cart.filter(item => item.id !== product.id));
  }

  return {
    products,
    cart,
    totalPrice,
    loading,
    categories,
    searchQuery,
    setSearchQuery,
    thriftCategories,
    shirtsCategories,
    shoesCategories,
    gadgetsCategories,
    changeCategories,
    searchProducts,
    addToCart,
    decreaseQuantity,
    removeFromCart
  };
};