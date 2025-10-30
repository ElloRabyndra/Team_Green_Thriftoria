import { Routes, Route, Navigate } from "react-router";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import AuthRedirect from "@/components/auth/AuthRedirect";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import MainPage from "@/pages/MainPage";
import Register from "@/components/auth/Register";
import Login from "@/components/auth/Login";
import Profile from "@/components/auth/Profile";
import ProductList from "@/components/product/ProductList";
import ProductDetail from "@/components/product/ProductDetail";
import CartList from "@/components/cart/CartList";
import "@/style/Style.css";
import AddProduct from "@/components/product/AddProduct";
import EditProduct from "@/components/product/EditProduct";
import Dashboard from "@/components/dashboard/Dashboard";
import RegisterShop from "@/components/dashboard/buyer/RegisterShop";
import Checkout from "@/components/cart/Checkout";
import MyOrder from "@/components/dashboard/buyer/MyOrder";
import OrderDetail from "@/components/dashboard/buyer/OrderDetail";
import OrderHistory from "@/components/dashboard/buyer/OrderHistory";
import ViewShop from "@/components/auth/ViewShop";
import MyProductList from "@/components/dashboard/seller/MyProductList";
import MySales from "@/components/dashboard/seller/MySales";
import SaleDetail from "@/components/dashboard/seller/SaleDetail";
import MyShop from "@/components/dashboard/seller/MyShop";
import BuyerList from "@/components/dashboard/admin/BuyerList";
import ShopsList from "@/components/dashboard/admin/ShopsList";
import PendingList from "@/components/dashboard/admin/PendingList";

const Routing = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <section
      className={`${theme} bg-background text-foreground font-[Poppins] min-h-screen`}
    >
      <Routes>
        <Route element={<AuthPage />}>
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
        </Route>
        <Route path="/" element={<MainPage />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/:shopId"
            element={
              <ProtectedRoute>
                <ViewShop />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="register-shop"
              element={
                <ProtectedRoute>
                  <RegisterShop />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-shop"
              element={
                <ProtectedRoute>
                  <MyShop />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-product"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit-product/:id"
              element={
                <ProtectedRoute>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <MyOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="order/:orderId"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="order-history"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-products"
              element={
                <ProtectedRoute>
                  <MyProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="sales"
              element={
                <ProtectedRoute>
                  <MySales />
                </ProtectedRoute>
              }
            />
            <Route
              path="sale/:saleId"
              element={
                <ProtectedRoute>
                  <SaleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="buyers"
              element={
                <ProtectedRoute>
                  <BuyerList />
                </ProtectedRoute>
              }
            />
            <Route
              path="shops"
              element={
                <ProtectedRoute>
                  <ShopsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="shops/pending"
              element={
                <ProtectedRoute>
                  <PendingList />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            index
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </section>
  );
};

export default Routing;
