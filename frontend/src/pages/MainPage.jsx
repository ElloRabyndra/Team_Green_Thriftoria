import React, { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/Navbar";
import { Outlet } from "react-router";

export default function MainPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  const {
    products,
    cart,
    totalPrice,
    loading,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    searchProducts,
    changeCategory,
    loadCart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useProducts();

  // Load cart saat user tersedia
  useEffect(() => {
    if (user?.id) {
      loadCart(user.id);
    }
  }, [user?.id]);

  // Wrapper functions yang include userId
  const handleAddToCart = async (product) => {
    if (!user?.id) {
      console.error("User not logged in");
      return false;
    }
    return await addToCart(user.id, product);
  };

  const handleIncreaseQuantity = async (cartItem) => {
    if (!user?.id) return;
    await increaseQuantity(user.id, cartItem);
  };

  const handleDecreaseQuantity = async (cartItem) => {
    if (!user?.id) return;
    await decreaseQuantity(user.id, cartItem);
  };

  const handleRemoveFromCart = async (cartId) => {
    if (!user?.id) return;
    await removeFromCart(user.id, cartId);
  };

  return (
    <section className="min-h-screen">
      {/* Navbar */}
      <NavBar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchProducts={searchProducts}
      />

      {/* Main Layout */}
      <div className="flex flex-row">
        {/* Sidebar */}
        <SideBar
          isMobileMenuOpen={isMobileMenuOpen}
          selectedCategory={selectedCategory}
          changeCategory={changeCategory}
          cart={cart}
        />

        {/* Main Content */}
        <main className="flex-1 py-6 px-5 lg:py-8 lg:px-24">
          <div className="relative mx-auto md:ml-56">
            <Outlet
              context={{
                products,
                cart,
                totalPrice,
                loading,
                addToCart: handleAddToCart,
                increaseQuantity: handleIncreaseQuantity,
                decreaseQuantity: handleDecreaseQuantity,
                removeFromCart: handleRemoveFromCart,
              }}
            />
          </div>
        </main>
      </div>
    </section>
  );
}