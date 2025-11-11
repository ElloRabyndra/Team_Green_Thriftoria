import { Link, useLocation, useNavigate } from "react-router";
import { Card } from "./ui/card";
import {
  ShoppingCart,
  User,
  Shirt,
  Box,
  LayoutGrid,
  ShoppingBag,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useEffect } from "react";

export default function SideBar({ isMobileMenuOpen }) {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { cart, loadCart } = useProducts();
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);
  const isSpecialPage =
    location.pathname === "/profile" ||
    location.pathname === "/cart" ||
    location.pathname === "/checkout" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/shop");

  // Load cart ketika user terautentikasi
  useEffect(() => {
    if (user?.id) {
      loadCart();
    }
  }, [user?.id, loadCart, cart]);

  // Fungsi untuk menghitung total kuantitas semua item di keranjang
  const totalCartQuantity = cart.reduce((totalShop, shopCart) => {
    const shopItemTotal = shopCart.cart_items
      ? shopCart.cart_items.reduce(
          (totalItem, item) => totalItem + item.quantity,
          0
        )
      : 0;
    return totalShop + shopItemTotal;
  }, 0);

  return (
    <Card
      className={`sidebar min-h-screen fixed z-10 right-0 bottom-0 top-16 mt-3 md:right-auto md:left-0 md:mt-0 shadow-xs border-none rounded-none w-60 border-r ${
        isMobileMenuOpen ? "sidebar-open" : "sidebar-close"
      }`}
    >
      <div className="py-6 px-4 md:py-0">
        <div className="space-y-3 mb-4">
          <h3 className="text-xs uppercase font-semibold mb-4 text-gray-500">
            User
          </h3>
          <Link
            to="/profile"
            className={`${
              isActive("/profile") || isActive("/shop")
                ? "bg-secondary/50 text-primary"
                : "hover:bg-secondary/50"
            } w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50 cursor-pointer`}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <Link
            to="/dashboard"
            className={`${
              isActive("/dashboard")
                ? "bg-secondary/50 text-primary"
                : "hover:bg-secondary/50"
            } w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-secondary/50 cursor-pointer`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          {/* Cek role */}
          {(user?.role === "buyer" || user?.role === "seller") && (
            <Link
              to="/cart"
              className={`${
                isActive("/cart") || isActive("/checkout")
                  ? "bg-secondary/50 text-primary"
                  : "hover:bg-secondary/50"
              } relative w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              <span className="absolute -top-1 left-6 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartQuantity}
              </span>
            </Link>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-xs uppercase font-semibold mb-4 text-gray-500">
            Categories
          </h3>
          <div className="space-y-2">
            <Link
              to="/products"
              className={`${
                !isSpecialPage &&
                (location.pathname === "/products" ||
                  location.pathname.startsWith("/product/") ||
                  location.pathname.startsWith("/products/search"))
                  ? "bg-secondary/50 text-primary"
                  : "hover:bg-secondary/50"
              } w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>All</span>
            </Link>
            <Link
              to="/products/fashion"
              className={`${
                !isSpecialPage && location.pathname === "/products/fashion"
                  ? "bg-secondary/50 text-primary"
                  : "hover:bg-secondary/50"
              } w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer`}
            >
              <Shirt className="h-5 w-5" />
              <span>Fashion</span>
            </Link>
            <Link
              to="/products/others"
              className={`${
                !isSpecialPage && location.pathname === "/products/others"
                  ? "bg-secondary/50 text-primary"
                  : "hover:bg-secondary/50"
              } w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer`}
            >
              <Box className="h-5 w-5" />
              <span>Others</span>
            </Link>
          </div>
        </div>
        {user ? (
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-semibold mb-4 text-gray-500">
              Preference
            </h3>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all duration-200 cursor-pointer"
            >
              <i className="bx bx-log-out text-2xl"></i>
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-semibold mb-4 text-gray-500">
              Preference
            </h3>
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-white bg-primary transition-all duration-200 cursor-pointer"
            >
              <LogIn className="h-5 w-5" />
              <span>User Login</span>
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
